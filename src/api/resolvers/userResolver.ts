import {User, UserWithoutPasswordRole} from '../../types/DBTypes';
import {MessageResponse} from '../../types/MessageTypes';
import userModel from '../models/userModel';
import bcrypt from 'bcrypt';

export default {
  Query: {
    users: async (): Promise<User[]> => {
      return await userModel.find();
    },
    user: async (_parent: undefined, args: {id: string}) => {
      const user = await userModel.findById(args.id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    },
  },
  Mutation: {
    register: async (
      _parent: undefined,
      args: {user: Omit<User, 'role'>},
    ): Promise<User> => {
      console.log('args', args);
      const hashedPassword = await bcrypt.hash(args.user.password, 10);
      const newUser = await userModel.create({
        user_name: args.user.user_name,
        email: args.user.email,
        password: hashedPassword,
      });
      if (!newUser) {
        throw new Error('Error creating user');
      }
      return newUser;
    },
    login: async (
      _parent: undefined,
      args: {credentials: {username: string; password: string}},
    ): Promise<
      MessageResponse & {token: string; user: UserWithoutPasswordRole}
    > => {
      const user = await userModel.findOne({email: args.credentials.username});
      if (!user) {
        throw new Error('User not found');
      }
      return {message: 'Login successful', token: 'token', user};
    },
    modifyUser: async (
      _parent: undefined,
      args: {id: string; user_name?: string; email?: string},
    ): Promise<User> => {
      const updatedUser = await userModel.findByIdAndUpdate(
        args.id,
        {
          user_name: args.user_name,
          email: args.email,
        },
        {
          new: true,
        },
      );
      if (!updatedUser) {
        throw new Error('User not found');
      }
      return updatedUser;
    },
    deleteUser: async (
      _parent: undefined,
      args: {id: string},
    ): Promise<User> => {
      const deletedUser = await userModel.findByIdAndDelete(args.id);
      if (!deletedUser) {
        throw new Error('User not found');
      }
      return deletedUser;
    },
  },
};
