import { IUser } from '../db';

export const isCorrectUserObject = (data: IUser) => {
  const allowedKeys = ['username', 'age', 'hobbies'];

  return (
    Object.keys(data).length >= 3 &&
    Object.entries(data).every(([key, value]) => allowedKeys.includes(key) && !!value)
  );
};
