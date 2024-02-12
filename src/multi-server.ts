import cluster from 'cluster';
import { availableParallelism } from 'os';
import process from 'process';
import { bootstrapServer } from './server';
import { mainController } from './controllers/main.controllers';
import { sendResponse } from './utils/sendResponse';
import { db } from './db';

const numCPUs = availableParallelism();
const workers: import('cluster').Worker[] = [];
let sharedBD = db;

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();

    worker.send(i);

    workers.push(worker);

    worker.on('message', function (msg) {
      if (msg.task === 'sync') {
        workers.forEach((worker) => {
          sharedBD = msg.data;

          worker.send({
            task: 'sync',
            data: sharedBD,
          });
        });
      }
    });
  }
} else {
  // prettier-ignore
  process.on('message', (msg: number | {
    task: string,
    data: any
  }) => {
    if (typeof msg !== 'number' && msg.task === 'sync') {
      db.splice(0, db.length, ...msg.data)
      return
    }

    const server = bootstrapServer(msg as number);

    server.on('request', async (req, res) => {
      try {
        const workerDB = await mainController(req, res);

       if (Array.isArray(workerDB)) {
         process.send?.({
           task: 'sync',
           data: workerDB,
         });
       }
      } catch (err) {
        sendResponse(res, 500, {
          message: 'Error on the server',
        });
      }
    });
  });
}
