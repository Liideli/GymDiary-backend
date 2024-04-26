import {Workout} from '../../types/DBTypes';
import {MyContext} from '../../types/MyContext';
import workoutModel from '../models/workoutModel';
import {GraphQLError} from 'graphql';

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
      args: {input: Omit<Workout, '_id'>; id: string},
      context: MyContext,
    ): Promise<{message: string; workout?: Workout}> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }
      const filter = {
        _id: args.id,
        owner: context.userdata.id,
      };
      const updatedWorkout = await workoutModel.findOneAndUpdate(
        filter,
        args.input,
        {new: true},
      );
      if (!updatedWorkout) {
        throw new Error('Error updating workout');
      }
      return {
        message: 'Workout updated successfully',
        workout: updatedWorkout,
      };
    },
    deleteWorkout: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ): Promise<{message: string; workout?: Workout}> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }
      const filter = {
        _id: args.id,
        owner: context.userdata.id,
      };
      const deletedWorkout = await workoutModel.findOneAndDelete(filter);
      if (!deletedWorkout) {
        throw new Error('Error deleting workout');
      }
      return {
        message: 'Workout deleted successfully',
        workout: deletedWorkout,
      };
    },
  },
};
