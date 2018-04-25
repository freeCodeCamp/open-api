const mongoose = require('mongoose');
const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
import typeDefs from '../graphql/typeDefs';
import resolvers from '../graphql/resolvers';
const graphqlSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
  logger: console
});

const UserModel = require('../dataLayer/model/user.js');

let connection;
let db;

beforeAll(async () => {
  connection = await mongoose.connect(global.__MONGO_URI__);
});

afterAll(async () => {
  await mongoose.disconnect();
});

it('should return a user after one has been created', async () => {
  const user = new UserModel({
    name: 'user',
    email: 'user@example.com'
  });

  const newUser = await user.save();

  //language=GraphQL
  const query = `
      query { 
          users {
              name
              email
          }
      }
    `;

  const rootValue = {};
  const result = await graphql(graphqlSchema, query, rootValue);
  const { data } = result;

  expect(data.users[0].name).toBe(user.name);
});
