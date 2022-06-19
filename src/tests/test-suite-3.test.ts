import { server } from '../server';
import request from 'supertest';
import { testUserObject, updateUserObject } from './test-utils';
import { v4 as uuidv4 } from 'uuid';

describe('Check behavior when calling a non-existent user object', () => {
  let id = '';
  let testUserObjectWithId = {};
  const randomUuidv4 = uuidv4();

  test("Create new user's object", async () => {
    const response = await request(server)
      .post('/api/users')
      .send(testUserObject)
      .expect('Content-Type', /json/)
      .expect(201);

    id = response.body.id;
    testUserObjectWithId = {
      ...response.body,
    };
    expect(response.body).toEqual(testUserObjectWithId);
    server.close();
  });

  test('Try to get non-existent user', async () => {
    await request(server)
      .get(`/api/users/${randomUuidv4}`)
      .expect(404)
      .expect({ message: 'User with this ID does not exist.' });
  });

  test('Try to update non-existent user', async () => {
    await request(server)
      .put(`/api/users/${randomUuidv4}`)
      .send(updateUserObject)
      .expect(404)
      .expect({ message: 'User with this ID does not exist.' });
  });

  test('Try to delete non-existent user', async () => {
    await request(server)
      .delete(`/api/users/${randomUuidv4}`)
      .expect(404)
      .expect({ message: 'User with this ID does not exist.' });
  });
});
