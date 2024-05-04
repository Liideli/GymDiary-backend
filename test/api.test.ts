import mongoose from 'mongoose';
import app from '../src/app';
import {getUsers, registerUser} from './userTests';
import randomstring from 'randomstring';
import {UserTest} from '../src/types/DBTypes';


describe('Testing graphql api', () => {
  const testUser: UserTest = {
    user_name: 'Testuser ' + randomstring.generate(7),
    email: randomstring.generate(6) + '@mail.com',
    password: 'testpassword',
  };

  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL as string);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // test get all users
  it('should return array of users', async () => {
    await getUsers(app);
  });

  // test register user
  it('should return the registered user', async () => {
    await registerUser(app, testUser);
  });
});
