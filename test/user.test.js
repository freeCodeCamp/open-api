import { graphqlSchema } from '../handler';

const mongoose = require('mongoose');
const { graphql } = require('graphql');
const UserModel = require('../dataLayer/model/user.js');

/* eslint-disable no-undef */
beforeAll(async () => {
  /* eslint-enable no-undef */
  await mongoose.connect(global.__MONGO_URI__);
});

/* eslint-disable no-undef */
afterAll(async () => {
  /* eslint-enable no-undef */
  await mongoose.disconnect();
});

it('should return a user after one has been created', async () => {
  const user = new UserModel({
    name: 'user',
    email: 'user@example.com'
  });

  await user.save();

  // language=GraphQL
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

  /* eslint-disable no-undef */
  expect(data.users[0].name).toBe(user.name);
  /* eslint-enable no-undef */
});
