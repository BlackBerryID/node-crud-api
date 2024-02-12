import { IUser } from '../db';

export const isCorrectUserObject = (data: IUser) => {
  const allowedKeys = ['id', 'username', 'age', 'hobbies'];

  return (
    Object.keys(data).length === 4 &&
    Object.entries(data).every(([key, value]) => allowedKeys.includes(key) && !!value)
  );
};
