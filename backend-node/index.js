const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;
app.use(express.json());


let products = JSON.parse(fs.readFileSync('product.json', 'utf-8'));


app.get('/api/products', (req, res) => {
  res.json(products);
});


app.get('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find((p) => p.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});


app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  newProduct.id = products.length ? products[products.length - 1].id + 1 : 1;
  products.push(newProduct);


  fs.writeFileSync('product.json', JSON.stringify(products, null, 2));
  res.status(201).json(newProduct);
});


app.put('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const index = products.findIndex((p) => p.id === productId);

  if (index !== -1) {
    products[index] = {...products[index], ...req.body, id: productId };

    fs.writeFileSync('product.json', JSON.stringify(products, null, 2));
    res.json(products[index]);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});


app.delete('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const index = products.findIndex((p) => p.id === productId);

  if (index !== -1) {
    const deletedProduct = products.splice(index, 1)[0];
    fs.writeFileSync('product.json', JSON.stringify(products, null, 2));
    res.json(deletedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
