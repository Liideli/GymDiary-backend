import {Application} from 'express';
import request from 'supertest';
import {UserTest} from '../src/types/DBTypes';

const getUsers = async (url: string | Application): Promise<UserTest[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `
        {users {
          id
          user_name
          email
          workoutCount
        }}`,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const users = response.body.data.users;
          expect(users).toBeInstanceOf(Array);
          expect(users[0]).toHaveProperty('id');
          expect(users[0]).toHaveProperty('user_name');
          expect(users[0]).toHaveProperty('email');
          resolve(response.body.data.users);
        }
      });
  });
};

// For some reason this test exceeds timeout
const registerUser = async (
  url: string | Application,
  user: UserTest,
): Promise<UserTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `
        mutation Register($user: UserInput!) {
          register(user: $user) {
            user {
              user_name
              email
              id
            }
            message
          }
        }`,
        variables: {
          user: {
            user_name: user.user_name,
            email: user.email,
            password: user.password,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const userData = response.body.data.register;
          expect(userData).toHaveProperty('user');
          expect(userData.user).toHaveProperty('id');
          expect(userData.user.user_name).toBe(user.user_name);
          expect(userData.user.email).toBe(user.email);
          resolve(response.body.data.register.user);
        }
      });
  });
};

export {getUsers, registerUser};
