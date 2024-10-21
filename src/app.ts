import http from 'node:http';
import dotenv from 'dotenv';
import { handleRequest } from './routes/userRoutes';

dotenv.config();

const host = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const server = http.createServer((req, res) => {
  handleRequest(req, res);
});

server.listen(port, host, () => {
  console.log(`Server running on the ${host}::${port}`);
});
