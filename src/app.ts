import http from 'node:http';
import { handleRequest } from 'routes/userRoutes';

const host = 'localhost';
const port = 4000;

const server = http.createServer((res, req) => {
  handleRequest(res, req);
});

server.listen(port, host, () => {
  console.log(`Server running on the ${host}::${port}`);
});
