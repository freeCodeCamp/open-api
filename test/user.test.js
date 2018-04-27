import { graphqlSchema } from '../handler';

const mongoose = require('mongoose');
const { graphql } = require('graphql');
const UserModel = require('../dataLayer/model/user.js');

/* eslint-disable no-undef */
beforeAll(async () => {
  await mongoose.connect(global.__MONGO_URI__);
});

afterAll(async () => {
  await mongoose.disconnect();
});

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

it(
  'should return null users and authentication error ' + ' without a token',
  async () => {
    const result = await graphql(
      graphqlSchema,
      query,
      rootValue,
      global.mockedContextWithOutToken
    );

    expect(result.data.users).toBe(null);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe(
      'You must supply a JSON Web Token for authorization!'
    );
  }
);

it(
  'should return null users and authentication error when using an invalid ' +
    'token',
  async () => {
    const result = await graphql(
      graphqlSchema,
      query,
      rootValue,
      global.mockedContextWithInValidToken
    );

    expect(result.data.users).toBe(null);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe(
      'You are not authorized, jwt malformed'
    );
  }
);

it('should return a user after one has been created', async () => {
  const user = new UserModel({
    name: 'user',
    email: 'user@example.com'
  });

  await user.save();

  const result = await graphql(
    graphqlSchema,
    query,
    rootValue,
    global.mockedContextWithValidToken
  );
  const { data } = result;

  expect(data.users[0].name).toBe(user.name);
});

/* eslint-enable no-undef */
