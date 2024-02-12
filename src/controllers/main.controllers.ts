import { IncomingMessage, ServerResponse } from 'http';
import { IUser, db } from '../db';
import { isCorrectUserObject } from '../utils/isCorrectUserObject';
import { sendResponse, IErrorResponseBody } from '../utils/sendResponse';

export const mainController = (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
  let responseStatusCode: number = 500;
  let response: IUser[] | IUser | IErrorResponseBody = {
    message: 'Error on the server',
  };

  if (req.method === 'GET' && req.url === '/api/users') {
    responseStatusCode = 200;
    response = db;
    sendResponse(res, responseStatusCode, response);
  }

  if (req.method === 'POST' && req.url === '/api/users') {
    let data = '';
    responseStatusCode = 200;

    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      const parsedData = JSON.parse(data);

      if (isCorrectUserObject(parsedData)) {
        db.push(parsedData);
        responseStatusCode = 201;
        response = parsedData as IUser;
      } else {
        responseStatusCode = 400;
        response = {
          message: "User object hasn't contained all required fields",
        };
      }

      sendResponse(res, responseStatusCode, response);
    });
  }

  console.log('req.url: ', req.url, req.method);
};
