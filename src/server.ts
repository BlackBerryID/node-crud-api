import http from 'http';
import 'dotenv/config';

import {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from './controllers/userController';

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  if (req.url === '/api/users' && req.method === 'GET') {
    getUsers(req, res);
  } else if ((req.url as string).match(/\/api\/users\/\w+/) && req.method === 'GET') {
    const id = (req.url as string).split('/')[3];
    getUser(req, res, id);
  } else if (req.url === '/api/users' && req.method === 'POST') {
    createUser(req, res);
  } else if ((req.url as string).match(/\/api\/users\/\w+/) && req.method === 'PUT') {
    const id = (req.url as string).split('/')[3];
    updateUser(req, res, id);
  } else if ((req.url as string).match(/\/api\/users\/\w+/) && req.method === 'DELETE') {
    const id = (req.url as string).split('/')[3];
    deleteUser(req, res, id);
  } else {
    res.writeHead(404, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
