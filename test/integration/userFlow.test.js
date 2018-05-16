/* global beforeAll afterAll expect */
import mongoose from 'mongoose';
import { graphql } from 'graphql';
import { pick } from 'lodash';
import UserModel from '../../src/dataLayer/model/user';
import { graphqlSchema } from '../../src/handler';

beforeAll(async function beforeAllTests() {
  await mongoose.connect(global.__MONGO_URI__);
});

afterAll(async function afterAllTests() {
  await mongoose.disconnect();
});

const contextNoToken = global.mockedContextWithOutToken;
const invalidContext = global.mockedContextWithInValidToken;
const validContextCharlie = global.mockedContextWithValidTokenForCharlie;
const validContextForLola = global.mockedContextWithValidTokenForLola;
const contextNoEmail = global.mockedContextWithNoEmailToken;
// language=GraphQL

const createUserQuery = `
mutation createUser {
  createUser {
    email
    name
  }
}
`;

const expectedUserQuery = `
    query {
        getUser(email: "charlie@thebear.me") {
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

const skippedMandatoryFieldQuery = `
  query {
    getUser {
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

describe('createUser', () => {
  it('should return null and an auth error without a token', done => {
    expect.assertions(2);

    graphql(graphqlSchema, createUserQuery, rootValue, contextNoToken)
      .then(({ data, errors }) => {
        expect(data.createUser).toMatchSnapshot('no user');
        expect(errors).toMatchSnapshot('not logged in');
        return;
      })
      .then(done)
      .catch(done);
  });

  it('should return null and an auth error with an invalid token', done => {
    expect.assertions(2);

    graphql(graphqlSchema, createUserQuery, rootValue, invalidContext)
      .then(({ data, errors }) => {
        expect(data.createUser).toMatchSnapshot('no user');
        expect(errors).toMatchSnapshot('no auth error');
        return;
      })
      .then(done)
      .catch(done);
  });

  it('should create a user by query', done => {
    expect.assertions(2);

    graphql(graphqlSchema, createUserQuery, rootValue, validContextCharlie)
      .then(({ data, errors }) => {
        expect(data.createUser).toMatchSnapshot('new user');
        expect(errors).toMatchSnapshot('no errors');
        return;
      })
      .then(done)
      .catch(done);
  });

  it('should raise an error without email in token', done => {
    graphql(graphqlSchema, createUserQuery, rootValue, contextNoEmail)
      .then(({ data, errors }) => {
        expect(data.createUser).toMatchSnapshot('null');
        expect(errors).toMatchSnapshot('no email');
        return;
      })
      .then(done)
      .catch(done);
  });

  it('should not create duplicate accounts', async done => {
    expect.assertions(4);
    const usersFound = await UserModel.find({
      email: 'charlie@thebear.me'
    }).exec();
    expect(usersFound).toHaveLength(1);
    expect(
      usersFound.map(obj => pick(obj, ['name', 'email', 'accountLinkId']))
    ).toMatchSnapshot('no duplicate users');

    graphql(graphqlSchema, createUserQuery, rootValue, validContextCharlie)
      .then(async function({ data, errors }) {
        expect(data.createUser).toBeNull();
        expect(errors).toMatchSnapshot('duplicate user error');
        return;
      })
      .then(done)
      .catch(done);
  });
});

describe('getUser', () => {
  it('should return null and an auth error without a token', done => {
    expect.assertions(2);

    graphql(graphqlSchema, expectedUserQuery, rootValue, contextNoToken)
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

    graphql(graphqlSchema, expectedUserQuery, rootValue, invalidContext)
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

    graphql(graphqlSchema, expectedUserQuery, rootValue, validContextCharlie)
      .then(({ data, errors }) => {
        expect(data).toMatchSnapshot('user found');
        expect(errors).toMatchSnapshot('no errors');
        return;
      })
      .then(done)
      .catch(done);
  });

  it('should return null if no user has been found', done => {
    expect.assertions(2);

    graphql(graphqlSchema, expectedNoUserQuery, rootValue, validContextCharlie)
      .then(result => {
        const { data, errors } = result;
        expect(data.getUser).toMatchSnapshot('null user');
        expect(errors).toMatchSnapshot('no user error');
        return;
      })
      .then(done)
      .catch(done);
  });

  it('should return errors for a query skipping a mandatory field', done => {
    expect.assertions(1);

    graphql(
      graphqlSchema,
      skippedMandatoryFieldQuery,
      rootValue,
      validContextCharlie
    )
      .then(result => {
        const { errors } = result;
        expect(errors).toMatchSnapshot('skipped mandatory field error');
        return;
      })
      .then(done)
      .catch(done);
  });

  it('should return errors for a malformed query', done => {
    expect.assertions(2);

    graphql(graphqlSchema, malformedQuery, rootValue, validContextCharlie)
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
