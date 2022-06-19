import http from 'http';
import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';

export const handleServerError = (res: http.ServerResponse) => {
  res.writeHead(500, { 'Content-type': 'application/json' });
  res.end(JSON.stringify({ message: 'Internal Server Error' }));
};

export const uuidValidateV4 = (uuid: string) => {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
};
