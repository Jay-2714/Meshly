const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const promClient = require('prom-client'); // Prometheus client for monitoring
const { log } = require('console');

const app = express();
const PORT = 4500;

app.use(express.json());

// MongoDB Connection
const uri = "mongodb+srv://jaysanjaymhatre2714:987654321@cluster0.ls7lh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let productsCollection;

async function connectToDatabase() {
  try {
    await client.connect();
    productsCollection = client.db("meshly").collection("products");
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
  }
}
connectToDatabase();

// Prometheus Metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5] 
});
promClient.collectDefaultMetrics();

app.use((req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const duration = process.hrtime(start);
    const seconds = duration[0] + duration[1] / 1e9;
    httpRequestDuration.labels(req.method, req.path, res.statusCode).observe(seconds);
  });
  next();
});

// API Endpoints
app.get('/api/products', async (req, res) => {
  try {
    const products = await productsCollection.find().toArray();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

app.get('/api/products/:id', async (req, res) => {
  const productId = parseInt(req.params.id);
  try {
    const product = await productsCollection.findOne({ id: productId });
    if (product) res.json(product);
    else res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = req.body;
    const lastProduct = await productsCollection.find().sort({ id: -1 }).limit(1).toArray();
    newProduct.id = lastProduct.length ? lastProduct[0].id + 1 : 1;
    await productsCollection.insertOne(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const productId = parseInt(req.params.id);
  try {
    const result = await productsCollection.updateOne({ id: productId }, { $set: req.body });
    if (result.matchedCount > 0) {
      const updatedProduct = await productsCollection.findOne({ id: productId });
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const productId = parseInt(req.params.id);
  try {
    const result = await productsCollection.deleteOne({ id: productId });
    if (result.deletedCount > 0) res.json({ message: 'Product deleted' });
    else res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});


app.get('/metrics', async (req, res) => {
  console.log('⚡ /metrics endpoint hit');
  try {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
  console.log('Metrics fetched');
}
catch (error) {
  console.error('❌ Error fetching metrics:', error);
}
});

// Call Post Method to Seed Data
async function callPostMethod() {
  try {
    const productsFilePath = path.join(__dirname, 'products.json');
    if (!fs.existsSync(productsFilePath)) {
      console.log("⚠️ products.json file not found");
      return;
    }

    const productsData = fs.readFileSync(productsFilePath, 'utf8');
    const products = JSON.parse(productsData);

    for (const product of products) {
      const response = await axios.post(`http://localhost:${PORT}/api/products`, product);
      console.log('✅ Product added:', response.data);
    }
  } catch (error) {

    console.error('❌ Error adding products:', error);
  }
}

// Start Server
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  callPostMethod();
});

