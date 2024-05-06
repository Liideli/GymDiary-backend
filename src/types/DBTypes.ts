import mongoose, {Document} from 'mongoose';

type User = Partial<Document> & {
  user_name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
};

type UserOutput = Omit<User, 'password' | 'role'>;

type UserInput = Omit<User, 'id' | 'role'>;

type UserWithoutPassword = Omit<User, 'password'>;

type UserWithoutPasswordRole = Omit<UserWithoutPassword, 'role'>;

type UserTest = Partial<User>;

type LoginUser = Omit<User, 'password'>;

type Workout = Partial<Document> & {
  _id?: mongoose.Types.ObjectId;
  id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  owner: mongoose.Types.ObjectId;
};

type Exercise = Partial<Document> & {
  _id?: mongoose.Types.ObjectId;
  id?: mongoose.Types.ObjectId;
  name: string;
  description: string;
  workout: mongoose.Types.ObjectId;
  sets: number;
  reps: number;
  weight: number;
  duration: number;
  owner: mongoose.Types.ObjectId;
};

type Group = Partial<Document> & {
  _id?: mongoose.Types.ObjectId;
  id?: mongoose.Types.ObjectId;
  name: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
};

type Member = {
  id: string;
  user_name: string;
  email: string;
  workoutCount?: number;
};

export {
  User,
  UserOutput,
  UserInput,
  UserWithoutPassword,
  UserWithoutPasswordRole,
  UserTest,
  LoginUser,
  Workout,
  Exercise,
  Group,
  Member,
};
