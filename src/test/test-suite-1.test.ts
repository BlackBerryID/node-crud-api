import { server } from '../app';
import request from 'supertest';
import { testUserObject, updateUserObject } from './test-utils';

describe('The application should work properly', () => {
  let id = '';
  let testUserObjectWithId = {};
  let updateUserObjectWithId = {};

  test('Get empty list of users', async () => {
    await request(server).get('/api/users').expect('Content-Type', /json/).expect(200).expect([]);
    server.close();
  });

  test("Create new user's object", async () => {
    const response = await request(server)
      .post('/api/users')
      .send(testUserObject)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body).toMatchObject(testUserObject);
    id = response.body.id;
    testUserObjectWithId = {
      ...response.body,
    };
    expect(response.body).toEqual(testUserObjectWithId);
    server.close();
  });

  test('Get created user', async () => {
    await request(server)
      .get(`/api/users/${id}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(testUserObjectWithId);

    server.close();
  });

  test('Update user', async () => {
    const response = await request(server)
      .put(`/api/users/${id}`)
      .send(updateUserObject)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toMatchObject(updateUserObject);
    updateUserObjectWithId = {
      ...response.body,
    };
    expect(response.body).toEqual(updateUserObjectWithId);

    server.close();
  });

  test('Delete user', async () => {
    await request(server).delete(`/api/users/${id}`).expect(204);
    server.close();
  });

  test('Try to get a deleted user', async () => {
    await request(server)
      .get(`/api/users/${id}`)
      .expect(404)
      .expect({ message: 'User with this ID does not exist.' });
    server.close();
  });
});
