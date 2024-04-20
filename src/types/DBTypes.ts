import {Document} from 'mongoose';

type User = Partial<Document> & {
  user_name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
};

type UserWithoutPassword = Omit<User, 'password'>;

type UserWithoutPasswordRole = Omit<UserWithoutPassword, 'role'>;

export {User, UserWithoutPassword, UserWithoutPasswordRole};
