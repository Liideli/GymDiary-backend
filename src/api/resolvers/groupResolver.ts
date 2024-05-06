import {Group, Member} from '../../types/DBTypes';
import {MyContext} from '../../types/MyContext';
import groupModel from '../models/groupModel';
import {GraphQLError} from 'graphql';
import workoutModel from '../models/workoutModel';

export default {
  Query: {
    group: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ) => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated');
      }
      const group = await groupModel
        .findById(args.id)
        .populate('owner members');
      if (!group) {
        throw new Error('Group not found');
      }
      // Fetch the workout count for each member
      for (const member of group.members as unknown as Member[]) {
        member.workoutCount = await workoutModel.countDocuments({
          owner: member.id,
        });
      }
      return group;
    },
    groups: async (context: MyContext): Promise<Group[]> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated');
      }
      return await groupModel.find().populate('owner members');
    },
  },
  Mutation: {
    createGroup: async (
      _parent: undefined,
      args: {input: Omit<Group, '_id'>},
      context: MyContext,
    ): Promise<{message: string; group?: Group}> => {
      console.log('args', args);
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }
      console.log('context.userdata', context.userdata);
      args.input.owner = context.userdata.id;
      args.input.members = [context.userdata.id];
      const newGroup = await groupModel.create(args.input);
      const populatedGroup = await groupModel.populate(newGroup, {
        path: 'owner members',
      });
      return {
        message: 'Group created successfully',
        group: populatedGroup,
      };
    },
    modifyGroup: async (
      _parent: undefined,
      args: {id: string; input: Omit<Group, '_id'>},
      context: MyContext,
    ): Promise<{message: string; group?: Group}> => {
      console.log('args', args);
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }
      const group = await groupModel.findById(args.id);
      if (!group) {
        throw new GraphQLError('Group not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      if (group.owner.toString() !== context.userdata.id) {
        throw new GraphQLError('User not authorized', {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }
      await groupModel.findByIdAndUpdate(args.id, args.input);
      return {
        message: 'Group updated successfully',
        group: args.input,
      };
    },
    deleteGroup: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ): Promise<{message: string; group?: Group | null}> => {
      console.log('args', args);
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }
      const group = await groupModel.findById(args.id);
      if (!group) {
        throw new GraphQLError('Group not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      if (group.owner.toString() !== context.userdata.id) {
        throw new GraphQLError('User not authorized', {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }
      const groupToDelete = await groupModel
        .findById(args.id)
        .populate('owner members');
      await groupModel.findByIdAndDelete(args.id);
      return {
        message: 'Group deleted successfully',
        group: groupToDelete,
      };
    },
    joinGroup: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ): Promise<{message: string; group?: Group}> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated');
      }
      const group = await groupModel.findById(args.id);
      if (!group) {
        throw new Error('Group not found');
      }

      if (group.members.includes(context.userdata.id)) {
        throw new Error('User is already a member of the group');
      }

      group.members.push(context.userdata.id);
      await group.save();

      const populatedGroup = await groupModel.populate(group, 'owner members');
      return {
        message: 'User joined the group successfully',
        group: populatedGroup,
      };
    },
    leaveGroup: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ): Promise<{message: string; group?: Group}> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated');
      }
      const group = await groupModel.findById(args.id);
      if (!group) {
        throw new Error('Group not found');
      }

      if (!group.members.includes(context.userdata.id)) {
        throw new Error('User is not a member of the group');
      }

      group.members = group.members.filter(
        (memberId) => memberId.toString() !== context.userdata!.id,
      );
      await group.save();

      const populatedGroup = await groupModel.populate(group, 'owner members');
      return {
        message: 'User left the group successfully',
        group: populatedGroup,
      };
    },
  },
};
