type User = {
  id?: string;
  username: string;
  age: number;
  hobbies: string[];
};

const db: User[] = [
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
