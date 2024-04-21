import mongoose, {Document} from 'mongoose';

type User = Partial<Document> & {
  user_name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
};

type UserWithoutPassword = Omit<User, 'password'>;

type UserWithoutPasswordRole = Omit<UserWithoutPassword, 'role'>;

type Workout = Partial<Document> & {
  _id?: mongoose.Types.ObjectId;
  id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  owner: mongoose.Types.ObjectId;
};

export {User, UserWithoutPassword, UserWithoutPasswordRole, Workout};
