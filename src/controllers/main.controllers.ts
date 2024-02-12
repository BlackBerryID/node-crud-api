import { IncomingMessage, ServerResponse } from 'http';
import { IUser, db } from '../db';
import { isCorrectUserObject } from '../utils/isCorrectUserObject';
import { sendResponse, IErrorResponseBody } from '../utils/sendResponse';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export const mainController = (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
  let responseStatusCode: number = 500;
  let response: IUser[] | IUser | IErrorResponseBody | undefined;
  const isCorrectEndpoint = '/' + req.url?.split('/').slice(1, 3).join('/') === '/api/users';

  return new Promise((resolve) => {
    // GET
    if (req.method === 'GET' && req.url === '/api/users') {
      responseStatusCode = 200;
      response = db;
      sendResponse(res, responseStatusCode, response);
      resolve(db);
    } else if (req.method === 'GET' && isCorrectEndpoint) {
      const userId = req.url?.split('/').at(-1) as string;
      if (!uuidValidate(userId)) {
        responseStatusCode = 400;
        response = {
          message: 'Invalid user ID.',
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
            message: 'User with this ID does not exist.',
          };
        }
      }

      sendResponse(res, responseStatusCode, response);
      resolve(db);
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
          const newUserObject = {
            id: uuidv4(),
            ...parsedData,
          };
          db.push(newUserObject);
          responseStatusCode = 201;
          response = newUserObject as IUser;
        } else {
          responseStatusCode = 400;
          response = {
            message: "The new user's object must contain the name, age and hobbies.",
          };
        }

        sendResponse(res, responseStatusCode, response);
        resolve(db);
        // PUT
      });
    } else if (req.method === 'PUT' && isCorrectEndpoint) {
      const userId = req.url?.split('/').at(-1) as string;
      if (!uuidValidate(userId)) {
        responseStatusCode = 400;
        response = {
          message: 'Invalid user ID.',
        };
        sendResponse(res, responseStatusCode, response);
        resolve(db);
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

            if (!isCorrectUserObject(parsedData)) {
              responseStatusCode = 400;
              response = {
                message: "The user's object with new data must contain the name, age and hobbies.",
              };
            } else {
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
            }

            sendResponse(res, responseStatusCode, response);
            resolve(db);
          });
        } else {
          responseStatusCode = 404;
          response = {
            message: 'User with this ID does not exist.',
          };
          sendResponse(res, responseStatusCode, response);
          resolve(db);
        }
      }
      // DELETE
    } else if (req.method === 'DELETE' && isCorrectEndpoint) {
      const userId = req.url?.split('/').at(-1) as string;
      if (!uuidValidate(userId)) {
        responseStatusCode = 400;
        response = {
          message: 'Invalid user ID.',
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
            message: 'User with this ID does not exist.',
          };
        }
      }

      sendResponse(res, responseStatusCode, response);
      resolve(db);
    } else {
      responseStatusCode = 404;
      response = {
        message: 'This url does not exist',
      };
      sendResponse(res, responseStatusCode, response);
      resolve(db);
    }
  });
};
