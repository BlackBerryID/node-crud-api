import { v4 as uuidv4 } from 'uuid';

import type { User } from '../typings';

let db: User[] = [
  {
    id: '111',
    age: 33,
    hobbies: [],
    username: 'Dima',
  },
];

export const getAll = () => {
  return new Promise((resolve, reject) => {
    resolve(db);
  });
};

export const getById = (id: string) => {
  return new Promise((resolve, reject) => {
    const result = db.find((user) => user.id === id);
    resolve(result);
  });
};

export const create = (user: User) => {
  return new Promise((resolve, reject) => {
    const newUser = { id: uuidv4(), ...user };
    db.push(newUser);
    resolve(newUser);
  });
};

export const update = (id: string, updateInfo: User) => {
  return new Promise((resolve, reject) => {
    let updatedUser: null | User = null;

    db = db.map((user) => {
      if (user.id === id) {
        updatedUser = {
          ...user,
          ...updateInfo,
        };
        return updatedUser;
      } else {
        return user;
      }
    });

    resolve(updatedUser);
  });
};
