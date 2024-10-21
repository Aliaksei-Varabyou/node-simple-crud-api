import { validate } from 'uuid';
import { parse } from 'node:url';
import { IncomingMessage } from 'node:http';
import { User } from '../models/user';

export const validateUUID = (id: string): boolean => {
  return validate(id);
};

export const validateUser = (username?: string, age?: number): boolean => {
  return !!username && typeof age === 'number';
};

export const parseUrl = (url: string | undefined) => {
  return parse(url || '', true);
};

export const getJsonRequestBody = (req: IncomingMessage): Promise<User> => {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        const json = JSON.parse(data);
        resolve(json);
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
};
