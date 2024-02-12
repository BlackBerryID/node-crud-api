import { bootstrapServer } from './server';
import { mainController } from './controllers/main.controllers';
import { sendResponse } from './utils/sendResponse';

const server = bootstrapServer();

server.on('request', (req, res) => {
  try {
    mainController(req, res);
  } catch (err) {
    sendResponse(res, 500, {
      message: 'Error on the server',
    });
  }
});

export { server };
