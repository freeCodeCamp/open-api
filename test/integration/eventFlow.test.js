/* global beforeAll afterAll expect */
import mongoose from 'mongoose';
import { graphql } from 'graphql';
import { createUser } from '../../src/dataLayer/mongo/user';
import { createCommunityEvent } from '../../src/dataLayer/mongo/communityEvent';
import { graphqlSchema } from '../../src/handler';

const contextNoToken = global.mockedContextWithOutToken;
const invalidContext = global.mockedContextWithInValidToken;
const validContextCharlie = global.mockedContextWithValidTokenForCharlie;
const contextNoEmail = global.mockedContextWithNoEmailToken;
const validContextForBrian = global.mockedContextWithValidTokenForBrian;
const validContextForDennis = global.mockedContextWithValidTokenForDennis;

const event = {
  title: 'epoch',
  description: 'The start of POSIX time',
  date: 'Thu 1 Jan 1970 00:00:00'
};

beforeAll(async function beforeAllTests() {
  await mongoose.connect(global.__MONGO_URI__);

  // Create two test users
  await createUser({}, {}, validContextForBrian);
  await createUser({}, {}, validContextForDennis);

  // Create a test event
  await createCommunityEvent({}, event, validContextForBrian);
});

afterAll(async function afterAllTests() {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

// language=GraphQL

const createCommunityEventQuery = `
mutation createCommunityEvent {
  createCommunityEvent(
    title: "epoch"
    description: "The start of POSIX time"
    date: "Thu 1 Jan 1970 00:00:0"
    attendees: [{email: "dennisritchie@example.com"}]
  ) {
    title
    description
    owner {
      email
      externalId
    }
  }
}
`;

const expectedCommunityEventQuery = `
    query {
        getCommunityEvent(title: "epoch") {
          title
          description
          owner {
            email
          }
        }
    }
  `;

const expectedNoCommunityEventQuery = `
    query {
      getCommunityEvent(title: "yeah nah") {
        title
        description
        owner {
          email
        }
      }
    }
  `;

const skippedMandatoryFieldQuery = `
  query {
    getCommunityEvent {
      title
      description
      owner {
        email
      }
    }
  }
`;

const malformedQuery = `
    query {
      getCommunityEvent(externalId: "yeah nah") {
        title
        description
        owner {
          email
        }
      }
    }
  `;

const rootValue = {};

describe('createEvent', () => {
  it('should return null and an auth error without a token', done => {
    expect.assertions(1);

    graphql(graphqlSchema, createCommunityEventQuery, rootValue, contextNoToken)
      .then(({ errors }) => {
        expect(errors).toMatchSnapshot('not logged in');
        return;
      })
      .then(done)
      .catch(done);
  });

  it('should return null and an auth error with an invalid token', done => {
    expect.assertions(1);

    graphql(graphqlSchema, createCommunityEventQuery, rootValue, invalidContext)
      .then(({ errors }) => {
        expect(errors).toMatchSnapshot('no auth error');
        return;
      })
      .then(done)
      .catch(done);
  });

  it('should create an event by query', done => {
    expect.assertions(2);

    graphql(
      graphqlSchema,
      createCommunityEventQuery,
      rootValue,
      validContextForBrian
    )
      .then(({ data, errors }) => {
        expect(data.createCommunityEvent).toMatchSnapshot('new event');
        expect(errors).toMatchSnapshot('no errors');
        return;
      })
      .then(done)
      .catch(done);
  });

  it('should raise an error without email in token', done => {
    expect.assertions(2);

    graphql(graphqlSchema, createCommunityEventQuery, rootValue, contextNoEmail)
      .then(({ data, errors }) => {
        expect(data.createCommunityEvent).toMatchSnapshot('null');
        expect(errors).toMatchSnapshot('no email');
        return;
      })
      .then(done)
      .catch(done);
  });
});

describe('getEvent', () => {
  it('should return an event after one has been created', done => {
    expect.assertions(2);

    graphql(
      graphqlSchema,
      expectedCommunityEventQuery,
      rootValue,
      validContextCharlie
    )
      .then(({ data, errors }) => {
        expect(data.getCommunityEvent).toMatchSnapshot('event found');
        expect(errors).toMatchSnapshot('no errors');
        return;
      })
      .then(done)
      .catch(done);
  });

  it('should return null if no event has been found', done => {
    expect.assertions(2);

    graphql(
      graphqlSchema,
      expectedNoCommunityEventQuery,
      rootValue,
      validContextCharlie
    )
      .then(result => {
        const { data, errors } = result;
        expect(data.getCommunityEvent).toMatchSnapshot('null event');
        expect(errors).toMatchSnapshot('no event error');
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
        expect(data.getCommunityEvent).toBe(null);
        expect(errors).toMatchSnapshot('malformed query error');
        return;
      })
      .then(done)
      .catch(done);
  });
});
