import http from 'http';

import * as UserModel from '../models/userModel';
import { handleServerError } from '../utils';

import type { User } from '../typings';

export const getUsers = async (req: http.IncomingMessage, res: http.ServerResponse) => {
  try {
    const users = await UserModel.getAll();
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(JSON.stringify(users));
  } catch (err) {
    handleServerError(res);
  }
};

export const createUser = async (req: http.IncomingMessage, res: http.ServerResponse) => {
  try {
    let body = '';

    req.on('data', (chunk) => {
      try {
        body += chunk.toString();
      } catch (err) {
        handleServerError(res);
      }
    });

    req.on('end', async () => {
      try {
        const newUser: User = JSON.parse(body);
        if (
          newUser.hasOwnProperty('username') &&
          newUser.hasOwnProperty('age') &&
          newUser.hasOwnProperty('hobbies')
        ) {
          const createdUser = await UserModel.create(newUser);
          res.writeHead(201, { 'Content-type': 'application/json' });
          res.end(JSON.stringify(createdUser));
        } else {
          res.writeHead(400, { 'Content-type': 'application/json' });
          res.end(
            JSON.stringify({
              message: "The new user's object must contain the name, age and hobbies.",
            })
          );
        }
      } catch (err) {
        handleServerError(res);
      }
    });
  } catch (err) {
    handleServerError(res);
  }
};
