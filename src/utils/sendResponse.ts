import { IncomingMessage, ServerResponse } from 'http';
import { IUser } from '../db';

export interface IErrorResponseBody {
  message: string;
}

export const sendResponse = (
  res: ServerResponse<IncomingMessage>,
  responseStatusCode: number,
  response: IUser[] | IUser | IErrorResponseBody | undefined,
) => {
  res.writeHead(responseStatusCode, { 'Content-Type': 'application/json' });

  if (response) {
    res.end(JSON.stringify(response));
  } else {
    res.end();
  }
};
