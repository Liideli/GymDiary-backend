import {User, UserWithoutPasswordRole, Workout} from '../../types/DBTypes';
import {MessageResponse} from '../../types/MessageTypes';
import userModel from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default {
  Workout: {
    owner: async (workout: Workout): Promise<UserWithoutPasswordRole> => {
      const user = await userModel.findById(workout.owner);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    },
  },
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
      const validPassword = await bcrypt.compare(
        args.credentials.password,
        user.password,
      );
      if (!validPassword) {
        throw new Error('Invalid password');
      }
      // generate a JWT with the user's data
      const token = jwt.sign(
        {id: user.id, email: user.email, user_name: user.user_name},
        process.env.JWT_SECRET as string,
      );
      return {message: 'Login successful', token, user};
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
