import {Exercise} from '../../types/DBTypes';
import {MessageResponse} from '../../types/MessageTypes';
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
    ): Promise<MessageResponse & {exercise?: Exercise}> => {
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
  },
};
