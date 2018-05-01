import { createUser, getUser } from '../../dataLayer/mongo/user';

export const userResolvers = {
  Query: {
    getGDPRUser: getUser
  },
  Mutation: {
    createUser
  }
};
