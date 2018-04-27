/* global beforeAll afterAll expect */
import { graphqlSchema } from '../../handler';

const mongoose = require('mongoose');
const { graphql } = require('graphql');
const UserModel = require('../../dataLayer/model/user.js');

beforeAll(async function beforeAllTests() {
  await mongoose.connect(global.__MONGO_URI__);
});

afterAll(async function afterAllTests() {
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

it('should return null users and auth error without a token', done => {
  graphql(graphqlSchema, query, rootValue, global.mockedContextWithOutToken)
    .then(result => {
      expect(result.data.users).toBe(null);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toBe(
        'You must supply a JSON Web Token for authorization!'
      );
      done();
    })
    .catch(done);
});

it('should return null users and auth error with an invalid token', done => {
  graphql(graphqlSchema, query, rootValue, global.mockedContextWithInValidToken)
    .then(result => {
      expect(result.data.users).toBe(null);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toBe(
        'You are not authorized, jwt malformed'
      );
      done();
    })
    .catch(done);
});

it('should return a user after one has been created', done => {
  const user = new UserModel({
    name: 'user',
    email: 'user@example.com'
  });

  user.save().then(() => {
    graphql(graphqlSchema, query, rootValue, global.mockedContextWithValidToken)
      .then(({ data }) => {
        expect(data.users[0].name).toBe(user.name);
        done();
      })
      .catch(done);
  });
});
