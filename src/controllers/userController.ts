import { IncomingMessage, ServerResponse } from 'node:http';

import {
  getJsonRequestBody,
  validateUser,
  validateUUID,
} from '../services/userService';
import { db, User } from '../models/user';

const buildResponse = (
  res: ServerResponse,
  data: unknown,
  status = 200,
): void => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

const getUserFromResponse = async (req: IncomingMessage): Promise<User> => {
  const data = await getJsonRequestBody(req);
  const id = data?.id ?? undefined;
  const username = data?.username ?? undefined;
  const age = data?.age ?? undefined;
  const hobbies = data?.hobbies ?? [];
  return { id, username, age, hobbies };
};

export const getUsers = (res: ServerResponse): void => {
  const users = db.getAllUsers();
  buildResponse(res, users);
};

export const getUserById = (
  res: ServerResponse,
  userId: string | undefined,
): void => {
  if (!userId || !validateUUID(userId)) {
    buildResponse(res, { message: 'Invalid UUID format' }, 400);
  } else {
    const user = db.getUserById(userId);
    if (!user) {
      buildResponse(res, { message: 'User not found' }, 404);
    }
    buildResponse(res, user);
  }
};

export const createUser = async (
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> => {
  const { username, age, hobbies } = await getUserFromResponse(req);
  if (!validateUser(username, age)) {
    buildResponse(res, { message: 'Missing required fields' }, 400);
  }

  const newUser = db.createUser(username, age, hobbies);
  buildResponse(res, newUser, 201);
};

export const updateUser = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string | undefined,
): Promise<void> => {
  if (!userId || !validateUUID(userId)) {
    buildResponse(res, { message: 'Invalid UUID format' }, 400);
  } else {
    const { username, age, hobbies } = await getUserFromResponse(req);
    const updatedUser = db.updateUser(userId, username, age, hobbies);
    if (!updatedUser) {
      buildResponse(res, { message: 'User not found' }, 404);
    } else {
      buildResponse(res, updatedUser, 200);
    }
  }
};

export const deleteUser = (
  res: ServerResponse,
  userId: string | undefined,
): void => {
  if (!userId || !validateUUID(userId)) {
    buildResponse(res, { message: 'Invalid UUID format' }, 400);
  } else {
    const isDeleted = db.deleteUser(userId);
    if (!isDeleted) {
      buildResponse(res, { message: 'User not found' }, 404);
    } else {
      buildResponse(res, '', 204);
    }
  }
};
