import {GraphQLError} from 'graphql';
import {Exercise} from '../../types/DBTypes';
import {MessageResponse} from '../../types/MessageTypes';
import {MyContext} from '../../types/MyContext';
import exerciseModel from '../models/exerciseModel';
import workoutModel from '../models/workoutModel';

export default {
  Query: {
    exercisesByWorkout: async (_parent: undefined, args: {workout: string}) => {
      const exercises = await exerciseModel.find({workout: args.workout});
      if (!exercises) {
        throw new Error('Exercises not found');
      }
      return exercises;
    },
  },
  Mutation: {
    createExercise: async (
      _parent: undefined,
      args: {input: Omit<Exercise, '_id'> & {workout: string}},
      context: MyContext,
    ): Promise<MessageResponse & {exercise?: Exercise}> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }
      args.input.owner = context.userdata.id;
      // validate the workout ID
      const workout = await workoutModel.findById(args.input.workout);
      if (!workout) {
        throw new Error('Workout not found');
      }
      args.input.workout = workout._id;
      // create the new exercise
      const newExercise = await exerciseModel.create(args.input);
      return {
        message: 'Exercise created successfully',
        exercise: newExercise,
      };
    },
    modifyExercise: async (
      _parent: undefined,
      args: {input: Omit<Exercise, '_id'>; id: string},
      context: MyContext,
    ): Promise<{message: string; exercise?: Exercise}> => {
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
      const updatedExercise = await exerciseModel.findOneAndUpdate(
        filter,
        args.input,
        {new: true},
      );
      if (!updatedExercise) {
        throw new Error('Error updating exercise');
      }
      return {
        message: 'Exercise updated successfully',
        exercise: updatedExercise,
      };
    },
    deleteExercise: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ): Promise<{message: string; exercise?: Exercise}> => {
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
      const deletedExercise = await exerciseModel.findOneAndDelete(filter);
      if (!deletedExercise) {
        throw new Error('Error deleting exercise');
      }
      return {
        message: 'Exercise deleted successfully',
        exercise: deletedExercise,
      };
    },
  },
};
