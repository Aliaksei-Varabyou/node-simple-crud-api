import http from 'node:http';
import { handleRequest } from './routes/userRoutes';
import dotenv from 'dotenv';

dotenv.config();

const host = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const server = http.createServer((res, req) => {
  handleRequest(res, req);
});

server.listen(port, host, () => {
  console.log(`Server running on the ${host}::${port}`);
});
