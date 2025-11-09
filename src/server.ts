import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { handleRequest } from './routes/userRoutes';

dotenv.config();

const host = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const server = createServer((request, result) => {
  handleRequest(request, result);
});

server.listen(port, host, () => {
  console.log(`Server running on the ${host}::${port}`);
});
