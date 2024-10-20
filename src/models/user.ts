import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

class InMemoryDB {
  private users: User[] = [];

  public createUser = (
    username: string,
    age: number,
    hobbies: string[] = [],
  ): User => {
    const newUser: User = {
      id: uuidv4(),
      username,
      age,
      hobbies,
    };

    this.users.push(newUser);
    return newUser;
  };

  public getUserById = (id: string): User | undefined => {
    return this.users.find((user) => user.id === id);
  };

  public getAllUsers = (): User[] => {
    return this.users;
  };

  public deleteUser = (id: string): boolean => {
    const deletedIndex = this.users.findIndex((user) => user.id === id);
    if (deletedIndex === -1) return false;

    this.users.splice(deletedIndex, 1);
    return true;
  };

  public updateUser = (
    id: string,
    username: string,
    age: number,
    hobbies: string[] = [],
  ): User | undefined => {
    const updatedUser = this.getUserById(id);
    if (!updatedUser) return undefined;

    updatedUser.username = username ?? updatedUser.username;
    updatedUser.age = age ?? updatedUser.age;
    updatedUser.hobbies = hobbies ?? updatedUser.hobbies;
    return updatedUser;
  };
}

export const db = new InMemoryDB();
