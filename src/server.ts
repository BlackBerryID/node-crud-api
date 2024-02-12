import http from 'http';
import 'dotenv/config';

export const bootstrapServer = (plusToPORT?: number) => {
  const server = http.createServer();
  let port = Number(process.env.PORT) || 3000;
  if (plusToPORT) {
    port += plusToPORT;
  }

  server.once('error', function (err: any) {
    if (err.code === 'EADDRINUSE') {
      // port is currently in use
      port = 5000;
    }
  });

  server.listen(port);

  console.log(`Server is running on port ${port}`);

  return server;
};
