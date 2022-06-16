import * as http from 'http';
import 'dotenv/config';

const server = http.createServer((req, res) => {
  console.log('WORKS');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server port ${PORT}`));
