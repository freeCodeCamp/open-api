import { createUser, getUser, deleteUser } from '../../dataLayer/mongo/user';

export const userResolvers = {
  Query: {
    getGDPRUser: getUser
  },
  Mutation: {
    createUser,
    deleteUser: deleteUser
  }
};
