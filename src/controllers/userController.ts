import http from 'http';

import * as User from '../models/userModel';
import { handleServerError } from '../utils';

export const getUsers = async (req: http.IncomingMessage, res: http.ServerResponse) => {
  try {
    const users = await User.getAll();
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(JSON.stringify(users));
  } catch (err) {
    handleServerError(res);
  }
};
