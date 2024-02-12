import { bootstrapServer } from './server';
import { mainController } from './controllers/main.controllers';

const server = bootstrapServer();

server.on('request', (req, res) => {
  mainController(req, res);
});
