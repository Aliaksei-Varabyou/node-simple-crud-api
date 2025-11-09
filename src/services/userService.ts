import { validate } from 'uuid';
import { IncomingMessage } from 'node:http';
import type { User } from '../models/user';

export const validateUUID = (id: string): boolean => {
  return validate(id);
};

export const validateUser = (username?: string, age?: number): boolean => {
  return !!username && typeof age === 'number';
};

export const parseUrl = (request: IncomingMessage) => {
  const url = request.url;
  const base = `http://${request.headers.host || 'localhost'}`;
  try {
    const parsedUrl = new URL(url || '', base);
    return {
      pathname: parsedUrl.pathname,
      query: Object.fromEntries(parsedUrl.searchParams.entries()),
    };
  } catch {
    return {
      pathname: '',
      query: {},
    };
  }
};

export const getJsonRequestBody = async (request: IncomingMessage): Promise<User> => {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
  }
  try {
    const json = JSON.parse(body);
    return json as User;
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};
