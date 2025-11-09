import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { handleRequest } from './routes/userRoutes';

dotenv.config({ debug: false });

const host = 'localhost';
const port = parseInt(process.env.PORT || '4000', 10);

export const server = createServer((request, result) => {
  handleRequest(request, result);
});

server.listen(port, host, () => {
  console.log(`Server running on the ${host}::${port}`);
});
