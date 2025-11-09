import { IncomingMessage, ServerResponse } from 'node:http';
import { parseUrl } from '../services/userService.ts';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.ts';
import type { UserResponse } from '../controllers/userController.ts';

export const handleServerError = (response: ServerResponse, error: unknown): void => {
  console.error('Server Error:', error);
  response.writeHead(500, { 'Content-Type': 'text/plain' });
  if (error instanceof Error) {
    response.end('Internal server Error: ' + error.message);
  } else {
    response.end('Internal server Error');
  }
};

export const handleRequest = async (
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> => {
  try {
    const { pathname } = parseUrl(request);
    let resp: UserResponse = { data: 'Method not found', status: 405 };

    switch (request.method) {
      case 'GET':
        if (pathname === '/api/users' || pathname === '/api/users/') {
          resp = getUsers();
        } else if (pathname?.startsWith('/api/users')) {
          const userId = pathname?.split('/')[3];
          resp = getUserById(userId);
        }
        break;
      case 'POST':
        if (pathname === '/api/users/' || pathname === '/api/users') {
          resp = await createUser(request);
        }
        break;
      case 'PUT':
        if (pathname?.startsWith('/api/users/')) {
          const userId = pathname.split('/')[3];
          resp = await updateUser(request, userId);
        }
        break;
      case 'DELETE':
        if (pathname?.startsWith('/api/users/')) {
          const userId = pathname.split('/')[3];
          resp = deleteUser(userId);
        }
        break;
    }
    response.writeHead(resp.status, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(resp.data));
  } catch (error) {
    handleServerError(response, error);
  }
};
