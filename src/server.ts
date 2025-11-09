import { createServer } from 'node:http';
import { handleRequest } from './routes/userRoutes';

const host = 'localhost';
const port = 4000;

const server = createServer((request, result) => {
  handleRequest(request, result);
});

server.listen(port, host, () => {
  console.log(`Server running on the ${host}::${port}`);
});
