import * as dbUsers from '../../dataLayer/mongo/user';

export const userResolvers = {
  Query: {
    users: (_, args) => dbUsers.getUsers(args)
  },
  Mutation: {
    createUser: (_, args) => dbUsers.createUser(args)
  }
};
