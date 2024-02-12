import http from 'http';
import 'dotenv/config';

export const bootstrapServer = () => {
  const server = http.createServer();
  server.listen(process.env.PORT);

  return server;
};
