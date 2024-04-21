import {Workout} from '../../types/DBTypes';
import {MessageResponse} from '../../types/MessageTypes';
import {MyContext} from '../../types/MyContext';
import workoutModel from '../models/workoutModel';
import {GraphQLError} from 'graphql';

console.log('workoutResolvers.ts called');

export default {
  Query: {
    workouts: async (): Promise<Workout[]> => {
      console.log('workouts called');
      return await workoutModel.find();
    },
    workout: async (_parent: undefined, args: {id: string}) => {
      const workout = await workoutModel.findById(args.id);
      if (!workout) {
        throw new Error('Workout not found');
      }
      return workout;
    },
    workoutsByOwner: async (_parent: undefined, args: {owner: string}) => {
      const workouts = await workoutModel.find({owner: args.owner});
      if (!workouts) {
        throw new Error('Workouts not found');
      }
      return workouts;
    },
  },
  Mutation: {
    createWorkout: async (
      _parent: undefined,
      args: {input: Omit<Workout, '_id'>},
      context: MyContext,
    ): Promise<{message: string; workout?: Workout}> => {
      console.log('args', args);
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }
      args.input.owner = context.userdata.id;
      const newWorkout = await workoutModel.create(args.input);
      return {
        message: 'Workout created successfully',
        workout: newWorkout,
      };
    },
    modifyWorkout: async (
      _parent: undefined,
      args: {
        id: string;
        title?: string;
        description?: string;
        date?: Date;
      },
    ): Promise<Workout> => {
      const updatedWorkout = await workoutModel.findByIdAndUpdate(
        args.id,
        {
          title: args.title,
          description: args.description,
          date: args.date,
        },
        {new: true},
      );
      if (!updatedWorkout) {
        throw new Error('Error updating workout');
      }
      return updatedWorkout;
    },
    deleteWorkout: async (
      _parent: undefined,
      args: {id: string},
    ): Promise<MessageResponse> => {
      const deletedWorkout = await workoutModel.findByIdAndDelete(args.id);
      if (!deletedWorkout) {
        throw new Error('Error deleting workout');
      }
      return {message: 'Workout deleted'};
    },
  },
};
