import { IncomingMessage, ServerResponse } from 'node:http';
import { parseUrl } from '../services/userService';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';

export const handleRequest = (
  request: IncomingMessage,
  response: ServerResponse,
): void => {
  const { pathname } = parseUrl(request);

  switch (request.method) {
    case 'GET': 
      if (pathname == '/api/users') {
        getUsers(response)
      } else if (pathname?.startsWith('/api/users')) {
        const userId = pathname?.split('/')[3];
        getUserById(response, userId);
      }
      break;
    case 'POST':
      if (pathname === '/api/users/') {
        createUser(request, response);
      }
      break;
    case 'PUT':
      if (pathname?.startsWith('/api/users/')) {
        const userId = pathname.split('/')[3];
        updateUser(request, response, userId);
      }
      break;
    case 'DELETE':
      if (pathname?.startsWith('/api/users/')) {
        const userId = pathname.split('/')[3];
        deleteUser(response, userId);
      }
      break;
    default:
      response.writeHead(405);
      response.end('Method not found');
  };
};
