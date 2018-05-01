import { createUser, getUsers } from '../../dataLayer/mongo/user';

export const userResolvers = {
  Query: {
    users: getUsers
  },
  Mutation: {
    createUser: (_, { email }) => dbUsers.createUser(email)
  }
};
