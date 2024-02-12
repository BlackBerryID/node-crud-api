import http from 'http';
import 'dotenv/config';

export const bootstrapServer = (plusToPORT?: number) => {
  const server = http.createServer();
  let port = Number(process.env.PORT) || 3000;
  if (plusToPORT) {
    port += plusToPORT;
  }

  server.listen(port);

  console.log(`Server is running on port ${port}`);

  return server;
};
