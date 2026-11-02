import express from 'express';

const app = express();
app.use(express.json());

let cart = [
  { id: 1, productName: 'Wireless Mouse', price: 799, quantity: 2, category: 'Electronics' },
  { id: 2, productName: 'Notebook', price: 99, quantity: 5, category: 'Stationery' },
  { id: 3, productName: 'Water Bottle', price: 349, quantity: 1, category: 'Home' }
];

const withTotal = item => ({ ...item, total: item.price * item.quantity });

const isValid = body =>
  body &&
  typeof body.productName === 'string' && body.productName.trim() !== '' &&
  typeof body.price === 'number' && body.price > 0 &&
  typeof body.quantity === 'number' && body.quantity > 0 &&
  typeof body.category === 'string' && body.category.trim() !== '';

app.get('/cart', (req, res) => {
  res.json(cart.map(withTotal));
});

app.get('/cart/:id', (req, res) => {
  const item = cart.find(i => i.id === Number(req.params.id));
  if (!item) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(withTotal(item));
});

app.post('/cart', (req, res) => {
  if (typeof req.body?.id !== 'number' || !isValid(req.body)) {
    return res.status(400).json({ error: 'id, productName, price, quantity and category are required and must be valid' });
  }
  if (cart.some(i => i.id === req.body.id)) {
    return res.status(409).json({ error: 'Product with this id already exists' });
  }
  const { id, productName, price, quantity, category } = req.body;
  const product = { id, productName, price, quantity, category };
  cart.push(product);
  res.status(201).json({ message: 'Product added successfully', product });
});

app.put('/cart/:id', (req, res) => {
  const item = cart.find(i => i.id === Number(req.params.id));
  if (!item) {
    return res.status(404).json({ error: 'Product not found' });
  }
  if (!isValid(req.body)) {
    return res.status(400).json({ error: 'Invalid product details' });
  }
  const { productName, price, quantity, category } = req.body;
  Object.assign(item, { productName, price, quantity, category });
  res.json({ message: 'Product updated successfully', product: withTotal(item) });
});

app.delete('/cart/:id', (req, res) => {
  const index = cart.findIndex(i => i.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const [removed] = cart.splice(index, 1);
  res.json({ message: 'Product deleted successfully', product: removed });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(4000, () => console.log('Express Server running at http://localhost:4000'));