import { server } from '../app';
import request from 'supertest';
import { testUserObject } from './test-utils';

describe('Check behavior when sending an invalid user object', () => {
  let id = '';
  let testUserObjectWithId = {};

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

  test('Try to get user with invalid id', async () => {
    const fakeId = `fake-${id}`;
    await request(server)
      .get(`/api/users/${fakeId}`)
      .expect(400)
      .expect({ message: 'Invalid user ID.' });
  });

  test("Try to add user with invalid user's object", async () => {
    const invalidUserObject = {
      username: testUserObject.username,
      age: testUserObject.age,
    };
    await request(server).post(`/api/users`).send(invalidUserObject).expect(400).expect({
      message: "The new user's object must contain the name, age and hobbies.",
    });
  });

  test("Try to update user with invalid user's object", async () => {
    const invalidUserObject = {
      username: testUserObject.username,
      age: testUserObject.age,
    };
    await request(server).put(`/api/users/${id}`).send(invalidUserObject).expect(400).expect({
      message: "The user's object with new data must contain the name, age and hobbies.",
    });
  });

  test("Try to delete user with invalid user's object", async () => {
    const fakeId = `fake-${id}`;
    await request(server)
      .delete(`/api/users/${fakeId}`)
      .expect(400)
      .expect({ message: 'Invalid user ID.' });
  });
});
