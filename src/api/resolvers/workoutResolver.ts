import {Workout} from '../../types/DBTypes';
import {MyContext} from '../../types/MyContext';
import groupModel from '../models/groupModel';
import workoutModel from '../models/workoutModel';
import {GraphQLError} from 'graphql';

export default {
  Query: {
    workoutsByUser: async (
      _parent: undefined,
      args: {owner: string},
      context: MyContext,
    ): Promise<Workout[]> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated');
      }
      return await workoutModel.find({owner: args.owner});
    },
    workout: async (_parent: undefined, args: {id: string}) => {
      const workout = await workoutModel.findById(args.id);
      if (!workout) {
        throw new Error('Workout not found');
      }
      return workout;
    },
    workoutsByOwner: async (
      _parent: undefined,
      args: {owner: string},
      context: MyContext,
    ): Promise<Workout[]> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated');
      }

      // Fetch the groups of the authenticated user
      const userGroups = await groupModel.find({members: context.userdata.id});
      // Fetch the groups of the owner
      const ownerGroups = await groupModel.find({members: args.owner});
      // Check if they have a group in common
      const commonGroups = userGroups.filter((userGroup) =>
        ownerGroups.some((ownerGroup) => ownerGroup.id === userGroup.id),
      );
      if (commonGroups.length === 0) {
        throw new Error('User and owner are not in the same group');
      }

      // Fetch the workouts of the owner
      const workouts = await workoutModel.find({owner: args.owner});

      return workouts;
    },
    workoutBySearch: async (
      _parent: undefined,
      args: {search: string; owner: string},
    ) => {
      const workouts = await workoutModel.find({
        title: {$regex: args.search, $options: 'i'},
        owner: args.owner,
      });
      console.log('workouts', workouts);
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
