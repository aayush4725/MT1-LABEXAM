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

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === 'GET' && url === '/') {
    return send(res, 200, 'text/html', '<h1>Welcome to the Shopping Cart App</h1>');
  }

  if (method === 'GET' && url === '/cart') {
    return send(res, 200, 'application/json', JSON.stringify(cart));
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

  send(res, 404, 'text/html', '<h1>404 Not Found</h1>');
});

server.listen(3000, () => console.log('HTTP Server running at http://localhost:3000'));