import { IncomingMessage, ServerResponse } from 'http';
import { IUser, db } from '../db';
import { isCorrectUserObject } from '../utils/isCorrectUserObject';
import { sendResponse, IErrorResponseBody } from '../utils/sendResponse';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export const mainController = (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
  let responseStatusCode: number = 500;
  let response: IUser[] | IUser | IErrorResponseBody | undefined;

  // GET
  if (req.method === 'GET' && req.url === '/api/users') {
    responseStatusCode = 200;
    response = db;
    sendResponse(res, responseStatusCode, response);
  } else if (req.method === 'GET') {
    const userId = req.url?.split('/').at(-1) as string;
    if (!uuidValidate(userId)) {
      responseStatusCode = 400;
      response = {
        message: 'User id is not valid',
      };
    } else {
      const data = db.find((item) => {
        return item.id === userId;
      });

      if (data) {
        responseStatusCode = 200;
        response = data;
      } else {
        responseStatusCode = 404;
        response = {
          message: 'User with this id is not found',
        };
      }
    }

    sendResponse(res, responseStatusCode, response);

    // POST
  } else if (req.method === 'POST' && req.url === '/api/users') {
    let data = '';
    responseStatusCode = 200;

    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      const parsedData = JSON.parse(data);

      if (isCorrectUserObject(parsedData)) {
        db.push({
          id: uuidv4(),
          ...parsedData,
        });
        responseStatusCode = 201;
        response = parsedData as IUser;
      } else {
        responseStatusCode = 400;
        response = {
          message: "User object hasn't contained all required fields",
        };
      }

      sendResponse(res, responseStatusCode, response);

      // PUT
    });
  } else if (req.method === 'PUT') {
    const userId = req.url?.split('/').at(-1) as string;
    if (!uuidValidate(userId)) {
      responseStatusCode = 400;
      response = {
        message: 'User id is not valid',
      };
      sendResponse(res, responseStatusCode, response);
    } else {
      const data = db.find((item) => {
        return item.id === userId;
      });

      if (data) {
        let dataFromReq = '';
        responseStatusCode = 200;

        req.on('data', (chunk) => {
          dataFromReq += chunk;
        });
        req.on('end', () => {
          let updatedData = {} as any;
          const parsedData = JSON.parse(dataFromReq);

          db.map((item, index) => {
            if (item.id === userId) {
              updatedData = {
                ...item,
                ...parsedData,
              };

              db[index] = updatedData as IUser;
            }
          });

          response = updatedData as IUser;
          sendResponse(res, responseStatusCode, response);
        });
      } else {
        responseStatusCode = 404;
        response = {
          message: 'User with this id is not found',
        };
        sendResponse(res, responseStatusCode, response);
      }
    }
    // DELETE
  } else if (req.method === 'DELETE') {
    const userId = req.url?.split('/').at(-1) as string;
    if (!uuidValidate(userId)) {
      responseStatusCode = 400;
      response = {
        message: 'User id is not valid',
      };
    } else {
      const index = db.findIndex((item) => {
        return item.id === userId;
      });

      if (index !== -1) {
        responseStatusCode = 204;
        db.splice(index, 1);
      } else {
        responseStatusCode = 404;
        response = {
          message: 'User with this id is not found',
        };
      }
    }

    sendResponse(res, responseStatusCode, response);
  }

  console.log('req.url: ', req.url, req.method);
};
