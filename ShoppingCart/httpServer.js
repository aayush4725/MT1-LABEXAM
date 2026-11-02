import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cart = [];

const send = (res, code, type, body) => {
  res.writeHead(code, { 'Content-Type': type });
  res.end(body);
};

const sendJson = (res, code, data) => send(res, code, 'application/json', JSON.stringify(data));

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === 'GET' && url === '/') {
    return send(res, 200, 'text/html', '<h1>Welcome to the Shopping Cart App</h1>');
  }

  if (method === 'GET' && url === '/cart') {
    return sendJson(res, 200, cart);
  }

  if (method === 'GET' && url === '/about') {
    return send(res, 200, 'text/html', '<h1>About</h1><p>Shopping Cart app built with the Node.js HTTP module.</p>');
  }

  if (method === 'GET' && url === '/home') {
    return fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
      if (err) {
        return send(res, 500, 'text/plain', 'Error reading file');
      }
      send(res, 200, 'text/html', data);
    });
  }

  if (url === '/add-to-cart') {
    if (method !== 'POST') {
      return sendJson(res, 405, { error: 'Method not allowed. Use POST' });
    }

    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      let parsed;
      try {
        parsed = JSON.parse(body);
      } catch {
        return sendJson(res, 400, { error: 'Invalid JSON' });
      }

      const { id, productName, price, quantity } = parsed;

      if (
        typeof id !== 'number' ||
        typeof productName !== 'string' || productName.trim() === '' ||
        typeof price !== 'number' || price <= 0 ||
        typeof quantity !== 'number' || quantity <= 0
      ) {
        return sendJson(res, 400, { error: 'id, productName, price and quantity are required and must be valid' });
      }

      if (cart.some(item => item.id === id)) {
        return sendJson(res, 409, { error: 'Product with this id already exists' });
      }

      const product = { id, productName, price, quantity };
      cart.push(product);
      sendJson(res, 201, { message: 'Product added successfully', product });
    });
    return;
  }

  send(res, 404, 'text/html', '<h1>404 Not Found</h1>');
});

server.listen(3000, () => console.log('HTTP Server running at http://localhost:3000'));