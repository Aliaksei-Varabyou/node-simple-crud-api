import { IncomingMessage, ServerResponse } from 'node:http';

import {
  getJsonRequestBody,
  validateUser,
  validateUUID,
} from '../services/userService';
import { db, User } from '../models/user';

const buildResponse = (
  response: ServerResponse,
  data: unknown,
  status = 200,
): void => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(data));
};

const getUserFromResponse = async (request: IncomingMessage): Promise<User> => {
  const data = await getJsonRequestBody(request);
  const id = data?.id ?? undefined;
  const username = data?.username ?? undefined;
  const age = data?.age ?? undefined;
  const hobbies = data?.hobbies ?? [];
  return { id, username, age, hobbies };
};

export const getUsers = (response: ServerResponse): void => {
  const users = db.getAllUsers();
  buildResponse(response, users);
};

export const getUserById = (
  response: ServerResponse,
  userId: string | undefined,
): void => {
  if (!userId || !validateUUID(userId)) {
    buildResponse(response, { message: 'Invalid UUID format' }, 400);
  } else {
    const user = db.getUserById(userId);
    if (!user) {
      buildResponse(response, { message: 'User not found' }, 404);
    }
    buildResponse(response, user);
  }
};

export const createUser = async (
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> => {
  const { username, age, hobbies } = await getUserFromResponse(request);
  if (!validateUser(username, age)) {
    buildResponse(response, { message: 'Missing required fields' }, 400);
  }

  const newUser = db.createUser(username, age, hobbies);
  buildResponse(response, newUser, 201);
};

export const updateUser = async (
  request: IncomingMessage,
  response: ServerResponse,
  userId: string | undefined,
): Promise<void> => {
  if (!userId || !validateUUID(userId)) {
    buildResponse(response, { message: 'Invalid UUID format' }, 400);
  } else {
    const { username, age, hobbies } = await getUserFromResponse(request);
    const updatedUser = db.updateUser(userId, username, age, hobbies);
    if (!updatedUser) {
      buildResponse(response, { message: 'User not found' }, 404);
    } else {
      buildResponse(response, updatedUser, 200);
    }
  }
};

export const deleteUser = (
  response: ServerResponse,
  userId: string | undefined,
): void => {
  if (!userId || !validateUUID(userId)) {
    buildResponse(response, { message: 'Invalid UUID format' }, 400);
  } else {
    const isDeleted = db.deleteUser(userId);
    if (!isDeleted) {
      buildResponse(response, { message: 'User not found' }, 404);
    } else {
      buildResponse(response, '', 204);
    }
  }
};
