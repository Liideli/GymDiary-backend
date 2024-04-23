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
    required: [true, 'Sets is required.'],
    min: [1, 'Sets must be greater than 0.'],
  },
  reps: {
    type: Number,
    required: [true, 'Reps is required.'],
    min: [1, 'Reps must be greater than 0.'],
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required.'],
    min: [1, 'Weight must be greater than 0.'],
  },
  duration: {
    type: Number,
    min: [1, 'Duration must be greater than 0.'],
  },
});

export default mongoose.model<Exercise>('Exercise', exerciseModel);
