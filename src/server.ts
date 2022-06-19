import http from 'http';
import 'dotenv/config';

import { getUsers } from './controllers/userController';

const server = http.createServer((req, res) => {
  if (req.url === '/users') {
    getUsers(req, res);
  } else {
    res.writeHead(404, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
