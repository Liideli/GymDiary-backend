import mongoose from 'mongoose';
import {Group} from '../../types/DBTypes';

const groupSchema = new mongoose.Schema<Group>({
  name: {
    type: String,
    minlength: [3, 'Group name is required.'],
    unique: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required.'],
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  description: {
    type: String,
  },
});

export default mongoose.model<Group>('Group', groupSchema);
