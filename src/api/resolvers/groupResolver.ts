import {Group} from '../../types/DBTypes';
import {MyContext} from '../../types/MyContext';
import groupModel from '../models/groupModel';
import {GraphQLError} from 'graphql';

export default {
  Query: {
    groups: async (): Promise<Group[]> => {
      console.log('groups called');
      return await groupModel.find().populate('owner');
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
      const newGroup = await groupModel.create(args.input);
      const populatedGroup = await groupModel.populate(newGroup, 'owner');
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
        .populate('owner');
      await groupModel.findByIdAndDelete(args.id);
      return {
        message: 'Group deleted successfully',
        group: groupToDelete,
      };
    },
  },
};
