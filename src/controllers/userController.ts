import { IncomingMessage } from 'node:http';

import {
  getJsonRequestBody,
  validateUser,
  validateUUID,
} from '../services/userService';
import { db, User } from '../models/user';

export interface UserResponse {
  status: number;
  data: unknown;
}

const getUserFromRequest = async (req: IncomingMessage): Promise<User> => {
  const data = await getJsonRequestBody(req);
  const id = data?.id ?? undefined;
  const username = data?.username ?? undefined;
  const age = data?.age ?? undefined;
  const hobbies = data?.hobbies ?? [];
  return { id, username, age, hobbies };
};

export const getUsers = (): UserResponse => {
  const users = db.getAllUsers();
  return { data: users, status: 200 };
};

export const getUserById = (userId: string | undefined): UserResponse => {
  if (!userId || !validateUUID(userId)) {
    return { data: { message: 'Invalid UUID format' }, status: 400 };
  }
  const user = db.getUserById(userId);
  if (!user) {
    return { data: { message: 'User not found' }, status: 404 };
  }
  return { data: user, status: 200 };
};

export const createUser = async (
  req: IncomingMessage,
): Promise<UserResponse> => {
  const { username, age, hobbies } = await getUserFromRequest(req);
  if (!validateUser(username, age)) {
    return { data: { message: 'Missing required fields' }, status: 400 };
  }
  const newUser = db.createUser(username, age, hobbies);
  return { data: newUser, status: 200 };
};

export const updateUser = async (
  req: IncomingMessage,
  userId: string | undefined,
): Promise<UserResponse> => {
  if (!userId || !validateUUID(userId)) {
    return { data: { message: 'Invalid UUID format' }, status: 400 };
  }
  const { username, age, hobbies } = await getUserFromRequest(req);
  const updatedUser = db.updateUser(userId, username, age, hobbies);
  if (!updatedUser) {
    return { data: { message: 'User not found' }, status: 404 };
  }
  return { data: updatedUser, status: 200 };
};

export const deleteUser = (userId: string | undefined): UserResponse => {
  if (!userId || !validateUUID(userId)) {
    return { data: { message: 'Invalid UUID format' }, status: 400 };
  }
  const isDeleted = db.deleteUser(userId);
  if (!isDeleted) {
    return { data: { message: 'User not found' }, status: 404 };
  }
  return { data: '', status: 204 };
};
