import { IncomingMessage, ServerResponse } from 'node:http';

export const handleRequest = (
  req: IncomingMessage,
  res: ServerResponse,
): void => {
  console.log(req.url);

  res.writeHead(405);
  res.end('Method not found');
};
