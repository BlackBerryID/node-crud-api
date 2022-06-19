import http from 'http';

export const handleServerError = (res: http.ServerResponse) => {
  res.writeHead(500, { 'Content-type': 'application/json' });
  res.end(JSON.stringify({ message: 'Internal Server Error' }));
};
