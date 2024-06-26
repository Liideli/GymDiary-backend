import mongoose from 'mongoose';
import {Exercise} from '../../types/DBTypes';

const exerciseModel = new mongoose.Schema<Exercise>({
  name: {
    type: String,
    required: [true, 'Name is required.'],
  },
  description: {
    type: String,
  },
  workout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout',
    required: [true, 'Workout is required.'],
  },
  sets: {
    type: Number,
    min: [0, 'Sets must be greater than 0.'],
  },
  reps: {
    type: Number,
    min: [0, 'Reps must be greater than 0.'],
  },
  weight: {
    type: Number,
    min: [0, 'Weight must be greater than 0.'],
  },
  duration: {
    type: Number,
    min: [0, 'Duration must be greater than 0.'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required.'],
  },
});

export default mongoose.model<Exercise>('Exercise', exerciseModel);
