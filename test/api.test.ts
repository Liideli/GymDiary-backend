import mongoose from 'mongoose';
import app from '../src/app';
import {getUsers, loginUser, registerUser} from './userTests';
import randomstring from 'randomstring';
import {UserTest, Workout} from '../src/types/DBTypes';
import {
  workoutsByUser,
  workout,
  workoutsByOwner,
  workoutBySearch,
  createWorkout,
  modifyWorkout,
  deletedWorkout,
} from './workoutTests';

describe('Testing graphql api', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL as string);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  const testUser: UserTest = {
    user_name: 'Testuser ' + randomstring.generate(7),
    email: randomstring.generate(6) + '@mail.com',
    password: 'testpassword',
  };

  // test get all users
  it('should return array of users', async () => {
    await getUsers(app);
  });

  // test register user
  it('should return the registered user', async () => {
    await registerUser(app, testUser);
  });

  // test login
  it('should login user', async () => {
    const vars = {
      credentials: {
        user_name: testUser.email!,
        password: testUser.password!,
      },
    };
    await loginUser(app, vars);
  });

  it('should return workouts of the logged in user', async () => {
    const users = await getUsers(app);
    const user = users[0];
    const workouts = (await workoutsByUser(app, user.id)) as Array<Workout>;
    expect(workouts).toBeInstanceOf(Array);
  });

  it('should return workout by id', async () => {
    const users = await getUsers(app);
    const user = users[0];
    const userWorkouts = (await workoutsByUser(app, user.id)) as Array<Workout>;
    const singleWorkout = userWorkouts[0];
    const workoutByIdUser = await workout(app, singleWorkout.id);
    expect(workoutByIdUser).toBeInstanceOf(Object);
  });

  it('should return workouts by owner', async () => {
    const users = await getUsers(app);
    const user = users[0];
    const workouts = (await workoutsByOwner(app, user.id)) as Array<Workout>;
    expect(workouts).toBeInstanceOf(Array);
  });

  it('should return workouts by search', async () => {
    const users = await getUsers(app);
    const user = users[0];
    const workouts = (await workoutBySearch(app, user.id)) as Array<Workout>;
    expect(workouts).toBeInstanceOf(Array);
  });

  it('should create a workout', async () => {
    const users = await getUsers(app);
    const user = users[0];
    const workout = await createWorkout(app, user.id);
    expect(workout).toBeInstanceOf(Object);
  });

  it('should modify a workout', async () => {
    const users = await getUsers(app);
    const user = users[0];
    const workout = await modifyWorkout(app, user.id);
    expect(workout).toBeInstanceOf(Object);
  });

  it('should delete a workout', async () => {
    const users = await getUsers(app);
    const user = users[0];
    const workout = await deletedWorkout(app, user.id);
    expect(workout).toBeInstanceOf(Object);
  });
});
