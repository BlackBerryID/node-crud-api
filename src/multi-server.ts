import http from 'http';
import 'dotenv/config';
import os from 'os';
import cluster, { Worker } from 'cluster';

import {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from './controllers/userController';

const pid = process.pid;

if (cluster.isPrimary) {
  const count = os.cpus().length;
  console.log(`Primary pid: ${pid}`);
  console.log(`Starting ${count} forks`);
  for (let i = 0; i < count; i++) cluster.fork();
} else {
  const PORT = process.env.PORT || 5000;
  const id = (cluster.worker as Worker).id;
  console.log(`Worker: ${id}, pid: ${pid}, port: ${PORT}`);
  http
    .createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
      console.log(`Запрос обработал: Worker: ${id}, pid: ${pid}, port: ${PORT}`);
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
    })
    .listen(PORT);
}
