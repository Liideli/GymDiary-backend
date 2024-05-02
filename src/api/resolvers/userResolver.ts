import {GraphQLError} from 'graphql';
import {
  User,
  UserInput,
  UserWithoutPasswordRole,
  Workout,
} from '../../types/DBTypes';
import {LoginResponse, UserResponse} from '../../types/MessageTypes';
import {MyContext} from '../../types/MyContext';
import userModel from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import workoutModel from '../models/workoutModel';

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
      const users = await userModel.find().lean();
      const usersWithWorkoutCount = await Promise.all(
        users.map(async (user) => {
          const workoutCount = await workoutModel.countDocuments({
            owner: user._id,
          });
          return {...user, id: user._id.toString(), workoutCount};
        }),
      );
      console.log(usersWithWorkoutCount);
      return usersWithWorkoutCount;
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
      args: {credentials: {user_name: string; password: string}},
    ): Promise<
      LoginResponse & {token: string; user: UserWithoutPasswordRole}
    > => {
      const user = await userModel.findOne({email: args.credentials.user_name});
      if (!user) {
        throw new Error('User not found');
      }
      const validPassword = bcrypt.compareSync(
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
      args: {user: UserInput},
      context: MyContext,
    ): Promise<UserResponse> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {code: 'UNAUTHENTICATED'},
        });
      }
      const hashedPassword = await bcrypt.hash(args.user.password, 10);
      args.user.password = hashedPassword;
      const filter = {_id: context.userdata.id};
      const updatedUser = await userModel.findOneAndUpdate(filter, args.user, {
        new: true,
      });
      console.log(updatedUser);
      if (!updatedUser) {
        throw new Error('Error updating user');
      }
      return {message: 'User updated successfully', user: updatedUser};
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
