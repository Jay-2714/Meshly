use actix_web::{web, App, HttpServer, HttpResponse, Responder};
use mongodb::{bson::{doc, oid::ObjectId}, options::ClientOptions, Client, Collection};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Mutex;
use prometheus::{Encoder, HistogramVec, Registry, TextEncoder};
use futures::stream::TryStreamExt;

#[derive(Debug, Serialize, Deserialize)]
struct Product {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    id: Option<ObjectId>,
    name: String,
    price: f64,
}

struct AppState {
    db: Collection<Product>,
    request_duration: HistogramVec,
    registry: Registry,
}

async fn get_products(state: web::Data<Arc<Mutex<AppState>>>) -> impl Responder {
    let state = state.lock().await;
    let timer = state.request_duration.with_label_values(&["GET", "/api/products"]).start_timer();

    let cursor = state.db.find(None, None).await.unwrap();
    let products: Vec<Product> = cursor.try_collect().await.unwrap();

    timer.observe_duration();
    HttpResponse::Ok().json(products)
}

async fn add_product(
    state: web::Data<Arc<Mutex<AppState>>>,
    product: web::Json<Product>
) -> impl Responder {
    let state = state.lock().await;
    let timer = state.request_duration.with_label_values(&["POST", "/api/products"]).start_timer();

    let new_product = Product {
        id: None,
        name: product.name.clone(),
        price: product.price,
    };
    state.db.insert_one(new_product, None).await.unwrap();

    timer.observe_duration();
    HttpResponse::Created().finish()
}

async fn metrics(state: web::Data<Arc<Mutex<AppState>>>) -> impl Responder {
    let state = state.lock().await;
    let mut buffer = Vec::new();
    let encoder = TextEncoder::new();
    encoder.encode(&state.registry.gather(), &mut buffer).unwrap();
    HttpResponse::Ok().body(String::from_utf8(buffer).unwrap())
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let client_options = ClientOptions::parse("mongodb+srv://jaysanjaymhatre2714:987654321@cluster0.ls7lh.mongodb.net/").await.unwrap();
    let client = Client::with_options(client_options).unwrap();
    let db = client.database("meshly").collection::<Product>("products");

    let registry = Registry::new();
    let request_duration = HistogramVec::new(
        prometheus::opts!("http_request_duration_seconds", "Duration of HTTP requests").into(),
        &["method", "route"],
    ).unwrap();
    registry.register(Box::new(request_duration.clone())).unwrap();

    let state = Arc::new(Mutex::new(AppState { db, request_duration, registry }));

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(state.clone()))
            .route("/api/products", web::get().to(get_products))
            .route("/api/products", web::post().to(add_product))
            .route("/metrics", web::get().to(metrics))
    })
    .bind("0.0.0.0:5000")?
    .run()
    .await
}
