use actix_web::{web, App, HttpResponse, HttpServer, Result as ActixResult};
use mongodb::{
    bson::doc,
    options::ClientOptions,
    Client, Collection,
};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use std::fs;
use std::path::Path;
use prometheus::{Encoder, TextEncoder, HistogramVec, HistogramOpts, register_histogram_vec};
use lazy_static::lazy_static;
use std::time::Instant;
use futures::stream::TryStreamExt;
use actix_web::web::Json;
use tracing::{info, warn, error, Level};
use tracing_subscriber::{FmtSubscriber, EnvFilter};
use anyhow::{Context, Result};


#[derive(Serialize, Deserialize, Clone)]
struct Product {
    id: i32,
    name: String,
}

struct AppState {
    db: Collection<Product>,
}

lazy_static! {
    static ref HTTP_REQUEST_DURATION: HistogramVec = register_histogram_vec!(
        HistogramOpts::new("http_request_duration_seconds", "Duration of HTTP requests in seconds")
            .buckets(vec![0.01, 0.05, 0.1, 0.5, 1.0, 2.0, 5.0]),
        &["method", "route", "status_code"]
    )
    .unwrap_or_else(|e| {
        error!("Failed to register histogram: {}", e);
        panic!("Critical error: Failed to register metrics")
    });
}

async fn get_products(data: web::Data<Mutex<AppState>>) -> ActixResult<HttpResponse> {
    let start = Instant::now();
    
    // Using anyhow for error context and then mapping to an HttpResponse
    let result = async {
        let lock = data.lock().map_err(|e| anyhow::anyhow!("Mutex lock error: {}", e.to_string()))?;
        let db = &lock.db;
        let cursor = db.find(None, None).await.context("Failed to query products from database")?;
        let products: Vec<Product> = cursor.try_collect().await.context("Failed to collect products from cursor")?;
        Ok::<_, anyhow::Error>(products)
    }.await;

    let duration = start.elapsed();
    HTTP_REQUEST_DURATION
        .with_label_values(&["GET", "/api/products", "200"])
        .observe(duration.as_secs_f64());

    match result {
        Ok(products) => Ok(HttpResponse::Ok().json(products)),
        Err(e) => {
            error!("Error getting products: {:#}", e);
            Ok(HttpResponse::InternalServerError().body(format!("Internal server error: {}", e)))
        }
    }
}

async fn get_product_by_id(
    data: web::Data<Mutex<AppState>>,
    product_id: web::Path<i32>,
) -> ActixResult<HttpResponse> {
    let result = async {
        let lock = data.lock().map_err(|e| anyhow::anyhow!("Mutex lock error: {}", e.to_string()))?;
        let db = &lock.db;
        let filter = doc! { "id": *product_id };
        let product = db.find_one(filter, None).await.context("Failed to query product from database")?;
        Ok::<_, anyhow::Error>(product)
    }.await;

    match result {
        Ok(Some(product)) => Ok(HttpResponse::Ok().json(product)),
        Ok(None) => Ok(HttpResponse::NotFound().body("Product not found")),
        Err(e) => {
            error!("Error getting product by id: {:#}", e);
            Ok(HttpResponse::InternalServerError().body(format!("Internal server error: {}", e)))
        }
    }
}

async fn create_product(
    data: web::Data<Mutex<AppState>>,
    new_product: Json<Product>,
) -> ActixResult<HttpResponse> {
    let result = async {
        let lock = data.lock().map_err(|e| anyhow::anyhow!("Mutex lock error: {}", e.to_string()))?;
        let db = &lock.db;
        let inserted = db.insert_one(new_product.into_inner(), None)
            .await
            .context("Failed to insert product into database")?;
        Ok::<_, anyhow::Error>(inserted.inserted_id)
    }.await;

    match result {
        Ok(inserted_id) => Ok(HttpResponse::Created().json(inserted_id)),
        Err(e) => {
            error!("Error creating product: {:#}", e);
            Ok(HttpResponse::InternalServerError().body(format!("Internal server error: {}", e)))
        }
    }
}

async fn update_product(
    data: web::Data<Mutex<AppState>>,
    path: web::Path<i32>,
    updated_product: Json<Product>,
) -> ActixResult<HttpResponse> {
    let result = async {
        let lock = data.lock().map_err(|e| anyhow::anyhow!("Mutex lock error: {}", e.to_string()))?;
        let db = &lock.db;
        let filter = doc! { "id": *path };
        let replacement = updated_product.into_inner();
        let result = db.replace_one(filter, replacement, None)
            .await
            .context("Failed to update product in database")?;
        Ok::<_, anyhow::Error>(result)
    }.await;

    match result {
        Ok(result) => {
            if result.matched_count > 0 {
                Ok(HttpResponse::Ok().body("Product updated"))
            } else {
                Ok(HttpResponse::NotFound().body("Product not found"))
            }
        },
        Err(e) => {
            error!("Error updating product: {:#}", e);
            Ok(HttpResponse::InternalServerError().body(format!("Internal server error: {}", e)))
        }
    }
}

async fn delete_product(
    data: web::Data<Mutex<AppState>>,
    product_id: web::Path<i32>,
) -> ActixResult<HttpResponse> {
    let result = async {
        let lock = data.lock().map_err(|e| anyhow::anyhow!("Mutex lock error: {}", e.to_string()))?;
        let db = &lock.db;
        let filter = doc! { "id": *product_id };
        let result = db.delete_one(filter, None)
            .await
            .context("Failed to delete product from database")?;
        Ok::<_, anyhow::Error>(result)
    }.await;

    match result {
        Ok(result) => {
            if result.deleted_count > 0 {
                Ok(HttpResponse::Ok().body("Product deleted"))
            } else {
                Ok(HttpResponse::NotFound().body("Product not found"))
            }
        },
        Err(e) => {
            error!("Error deleting product: {:#}", e);
            Ok(HttpResponse::InternalServerError().body(format!("Internal server error: {}", e)))
        }
    }
}

async fn metrics() -> ActixResult<HttpResponse> {
    info!("⚡ /metrics endpoint hit");
    let encoder = TextEncoder::new();
    let mut buffer = Vec::new();
    let metric_families = prometheus::gather();

    match encoder.encode(&metric_families, &mut buffer) {
        Ok(_) => Ok(HttpResponse::Ok()
            .content_type(encoder.format_type())
            .body(buffer)),
        Err(e) => {
            error!("❌ Failed to encode Prometheus metrics: {:?}", e);
            Ok(HttpResponse::InternalServerError().body("Failed to encode metrics"))
        }
    }
}

async fn seed_data(data: web::Data<Mutex<AppState>>) -> Result<()> {
    let products_file_path = Path::new("products.json");
    if products_file_path.exists() {
        let products_data = fs::read_to_string(products_file_path)
            .context("Failed to read products.json file")?;
        
        let products: Vec<Product> = serde_json::from_str(&products_data)
            .context("Failed to parse products.json content")?;
        
        let lock = data.lock().map_err(|e| anyhow::anyhow!("Mutex lock error: {}", e.to_string()))?;
        let db = &lock.db;
        
        for product in products {
            db.insert_one(product, None)
                .await
                .context("Failed to insert product during seeding")?;
        }
        Ok(())
    } else {
        warn!("⚠️ products.json file not found");
        Ok(())
    }
}

#[actix_web::main]
async fn main() -> Result<()> {
    // Initialize the tracing subscriber
    let subscriber = FmtSubscriber::builder()
        .with_env_filter(EnvFilter::from_default_env())
        .with_max_level(Level::TRACE)
        .finish();
    
    tracing::subscriber::set_global_default(subscriber)
        .context("Failed to set tracing subscriber")?;

    info!("🔧 Starting backend-rust server...");

    let mongo_uri = "mongodb+srv://jaysanjaymhatre2714:987654321@cluster0.ls7lh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    let client_options = ClientOptions::parse(mongo_uri)
        .await
        .context("Failed to parse MongoDB connection string")?;
    
    let client = Client::with_options(client_options)
        .context("Failed to create MongoDB client")?;
    
    let db = client.database("meshly").collection::<Product>("products");
    info!("Connected to db");

    let data = web::Data::new(Mutex::new(AppState { db }));

    if let Err(e) = seed_data(data.clone()).await {
        error!("Failed to seed data: {:#}", e);
    }

    HttpServer::new(move || {
        App::new()
            .app_data(data.clone())
            .route("/metrics", web::get().to(metrics))
            .route("/api/products", web::get().to(get_products))
            .route("/api/products", web::post().to(create_product))
            .route("/api/products/{id}", web::get().to(get_product_by_id))
            .route("/api/products/{id}", web::put().to(update_product))
            .route("/api/products/{id}", web::delete().to(delete_product))
    })
    .workers(1)
    .bind(("0.0.0.0", 5000))
    .context("❌ Failed to bind to port 5000")?
    .run()
    .await
    .context("Server error")
}
