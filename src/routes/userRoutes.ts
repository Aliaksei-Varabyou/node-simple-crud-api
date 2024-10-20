import { IncomingMessage, ServerResponse } from 'node:http';
import { parseUrl } from '../services/userService';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../controllers/userController';

export const handleRequest = (
  req: IncomingMessage,
  res: ServerResponse,
): void => {
  const { pathname } = parseUrl(req.url);

  switch (req.method) {
    case 'GET':
      if (pathname === '/api/users/') {
        getUsers(res);
      } else if (pathname?.startsWith('/api/users')) {
        const userId = pathname.split('/')[3];
        getUserById(res, userId);
      }
      break;
    case 'POST':
      if (pathname === '/api/users/') {
        createUser(req, res);
      }
      break;
    case 'PUT':
      if (pathname?.startsWith('/api/users/')) {
        const userId = pathname.split('/')[3];
        updateUser(req, res, userId);
      }
      break;
    case 'DELETE':
      if (pathname?.startsWith('/api/users/')) {
        const userId = pathname.split('/')[3];
        deleteUser(res, userId);
      }
      break;
    default:
      res.writeHead(405);
      res.end('Method not found');
  }
};
