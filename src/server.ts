import http from 'http';
import 'dotenv/config';

import { getUsers } from './controllers/userController';

const server = http.createServer((req, res) => {
  if (req.url === '/users') {
    getUsers(req, res);
  } else {
    console.log('default');
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server port ${PORT}`));
