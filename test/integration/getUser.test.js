/* global beforeAll afterAll expect */
import mongoose from 'mongoose';
import { graphql } from 'graphql';

import { graphqlSchema } from '../../src/handler';
import UserModel from '../../src/dataLayer/model/user';

beforeAll(async function beforeAllTests() {
  await mongoose.connect(global.__MONGO_URI__);
});

afterAll(async function afterAllTests() {
  await mongoose.disconnect();
});

const contextNoToken = global.mockedContextWithOutToken;
const invalidContext = global.mockedContextWithInValidToken;
const validContext = global.mockedContextWithValidToken;

// language=GraphQL
const query = `
    query {
        getUser(email: "user@example.com") {
            name
            email
        }
    }
  `;

const expectedNoUserQuery = `
    query {
      getUser(email: "nowhere@tobe.seen") {
        name
        email
      }
    }
  `;

const malformedQuery = `
    query {
      getUser(email: "Ooops!") {
        name
        email
      }
    }
  `;

const rootValue = {};
describe('getUser', () => {
  it('should return null and an auth error without a token', done => {
    expect.assertions(2);

    graphql(graphqlSchema, query, rootValue, contextNoToken)
      .then(({ data, errors }) => {
        expect(data.getUser).toMatchSnapshot('no user');
        expect(errors).toMatchSnapshot('not logged in');
        return;
      })
      .then(done)
      .catch(done);
  });

  it('should return null and an auth error with an invalid token', done => {
    expect.assertions(2);

    graphql(graphqlSchema, query, rootValue, invalidContext)
      .then(({ data, errors }) => {
        expect(data.getUser).toMatchSnapshot('no user');
        expect(errors).toMatchSnapshot('no auth error');
        return;
      })
      .then(done)
      .catch(done);
  });

  it('should return a user after one has been created', done => {
    expect.assertions(2);

    const user = new UserModel({
      name: 'user',
      email: 'user@example.com',
      accountLinkId: 'a-unique-string-for-user@example.com'
    });

    user.save().then(() => {
      graphql(graphqlSchema, query, rootValue, validContext)
        .then(({ data, errors }) => {
          expect(data).toMatchSnapshot('user found');
          expect(errors).toMatchSnapshot('no errors');
          return;
        })
        .then(done)
        .catch(done);
    });
  });

  it('should return null if no user has been found', done => {
    expect.assertions(2);

    graphql(graphqlSchema, expectedNoUserQuery, rootValue, validContext)
      .then(result => {
        const { data, errors } = result;
        expect(data.getUser).toBe(null);
        expect(errors).toMatchSnapshot('no user error');
        return;
      })
      .then(done)
      .catch(done);
  });

  it('should return errors for a malformed query', done => {
    expect.assertions(2);

    graphql(graphqlSchema, malformedQuery, rootValue, validContext)
      .then(result => {
        const { data, errors } = result;
        expect(data.getUser).toBe(null);
        expect(errors).toMatchSnapshot('malformed query error');
        return;
      })
      .then(done)
      .catch(done);
  });
});
