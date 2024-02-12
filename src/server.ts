import http from 'http';
import 'dotenv/config';

export const bootstrapServer = () => {
  const server = http.createServer();
  server.listen(process.env.PORT);

  console.log(`Server is running on port ${process.env.PORT}`);

  return server;
};
