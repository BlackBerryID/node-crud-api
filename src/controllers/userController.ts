import http from 'http';

import * as UserModel from '../models/userModel';
import { handleServerError, uuidValidateV4 } from '../utils';

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

export const getUser = async (req: http.IncomingMessage, res: http.ServerResponse, id: string) => {
  try {
    if (!uuidValidateV4(id)) {
      res.writeHead(400, { 'Content-type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid user ID.' }));
      return;
    }

    const user = await UserModel.getById(id);

    if (user === undefined) {
      res.writeHead(404, { 'Content-type': 'application/json' });
      res.end(JSON.stringify({ message: 'User with this ID does not exist.' }));
    } else {
      res.writeHead(200, { 'Content-type': 'application/json' });
      res.end(JSON.stringify(user));
    }
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

export const updateUser = async (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  id: string
) => {
  try {
    if (!uuidValidateV4(id)) {
      res.writeHead(400, { 'Content-type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid user ID.' }));
    }

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
        const updateInfo: User = JSON.parse(body);
        if (
          updateInfo.hasOwnProperty('username') &&
          updateInfo.hasOwnProperty('age') &&
          updateInfo.hasOwnProperty('hobbies')
        ) {
          const updatedUser = await UserModel.update(id, updateInfo);
          if (updatedUser === null) {
            res.writeHead(404, { 'Content-type': 'application/json' });
            res.end(JSON.stringify({ message: 'User with this ID does not exist.' }));
          } else {
            res.writeHead(200, { 'Content-type': 'application/json' });
            res.end(JSON.stringify(updatedUser));
          }
        } else {
          res.writeHead(400, { 'Content-type': 'application/json' });
          res.end(
            JSON.stringify({
              message: "The user's object with new data must contain the name, age and hobbies.",
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

export const deleteUser = async (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  id: string
) => {
  try {
    if (!uuidValidateV4(id)) {
      res.writeHead(400, { 'Content-type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid user ID.' }));
    }

    const user = await UserModel.getById(id);

    if (user === undefined) {
      res.writeHead(404, { 'Content-type': 'application/json' });
      res.end(JSON.stringify({ message: 'User with this ID does not exist.' }));
    } else {
      await UserModel.remove(id);
      res.writeHead(204, { 'Content-type': 'application/json' });
      res.end();
    }
  } catch (err) {
    handleServerError(res);
  }
};
