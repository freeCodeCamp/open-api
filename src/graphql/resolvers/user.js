import { createUser, getUser, deleteUser } from '../../dataLayer/mongo/user';

export const userResolvers = {
  Query: {
    getUser
  },
  Mutation: {
    createUser,
    deleteUser
  }
};
