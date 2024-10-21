import { IncomingMessage, ServerResponse } from 'node:http';
import { parseUrl } from '../services/userService';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  UserResponse,
} from '../controllers/userController';

const handleServerError = (res: ServerResponse, error: unknown): void => {
  console.error('Server Error:', error);
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  if (error instanceof Error) {
    res.end('Internal Server Error: ' + error.message);
  } else {
    res.end('Internal Server Error');
  }
};

export const handleRequest = async (
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> => {
  try {
    const { pathname } = parseUrl(req.url);
    let response: UserResponse = { data: 'Method not found', status: 405 };

    switch (req.method) {
      case 'GET':
        if (pathname === '/api/users/' || pathname === '/api/users') {
          response = getUsers();
        } else if (pathname?.startsWith('/api/users')) {
          const userId = pathname.split('/')[3];
          response = getUserById(userId);
        }
        break;
      case 'POST':
        if (pathname === '/api/users/' || pathname === '/api/users') {
          response = await createUser(req);
        }
        break;
      case 'PUT':
        if (pathname?.startsWith('/api/users/')) {
          const userId = pathname.split('/')[3];
          response = await updateUser(req, userId);
        }
        break;
      case 'DELETE':
        if (pathname?.startsWith('/api/users/')) {
          const userId = pathname.split('/')[3];
          response = deleteUser(userId);
        }
        break;
    }

    res.writeHead(response.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response.data));
  } catch (error) {
    handleServerError(res, error);
  }
};
