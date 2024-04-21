import mongoose from 'mongoose';
import {Workout} from '../../types/DBTypes';

const workoutSchema = new mongoose.Schema<Workout>({
  title: {
    type: String,
    required: [true, 'Title is required.'],
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    required: [true, 'Date is required.'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required.'],
  },
});

export default mongoose.model<Workout>('Workout', workoutSchema);
