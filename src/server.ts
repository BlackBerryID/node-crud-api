import http from 'http';
import 'dotenv/config';

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({
    data: 'Hello World!'
  }))
})

console.log(process.env.PORT)

server.listen(process.env.PORT)