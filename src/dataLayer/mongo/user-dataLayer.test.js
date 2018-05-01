/* global expect beforeAll afterAll */
import { createUser, getUser } from './user';
import { isObject, isEmpty } from 'lodash';
import mongoose from 'mongoose';

const validContext = global.mockedContextWithValidToken;

beforeAll(async function beforeAllTests() {
  await mongoose.connect(global.__MONGO_URI__);
});

afterAll(async function afterAllTests() {
  await mongoose.disconnect();
});

describe('createUser', () => {
  it('should return a User object', done => {
    expect.assertions(2);
    createUser({}, {}, validContext)
      .then(result => {
        const { name, email, accountLinkId } = result;
        // there is some weird Promise thing going on with `result`
        // which screws with lodash.has()
        const hasKeys =
          !isEmpty(name) && !isEmpty(email) && !isEmpty(accountLinkId);

        expect(isObject(result)).toBe(true);
        expect(hasKeys).toBe(true);
        return;
      })
      .then(done)
      .catch(done);
  });

  it('should return user for accountLinkId if found in db', done => {
    expect.assertions(1);
    createUser({}, {}, validContext)
      .then(result => {
        expect(result.accountLinkId).toEqual(
          'a-very-unique-string-for-charlie@thebear.me'
        );
        return;
      })
      .then(done)
      .catch(done);
  });
});

describe('getUser', () => {
  it('should return a User object fo a valid request', done => {
    expect.assertions(2);
    const email = 'charlie@thebear.me';
    getUser({}, { email }, validContext)
      .then(result => {
        const { name, email, accountLinkId } = result;
        // there is some weird Promise thing going on with `result`
        // which screws with lodash.has()
        const hasKeys =
          !isEmpty(name) && !isEmpty(email) && !isEmpty(accountLinkId);

        expect(isObject(result)).toBe(true);
        expect(hasKeys).toBe(true);
        return;
      })
      .then(done)
      .catch(done);
  });

  it('should throw for a user not found', done => {
    expect.assertions(1);
    const email = 'not@inthe.db';
    getUser({}, { email }, validContext).catch(err => {
      expect(err.message).toContain('No user found for ');
      done();
    });
  });

  it('should throw if the supplied email is not valid', done => {
    expect.assertions(15);
    Promise.all([
      getUser({}, { email: 1 }, validContext).catch(err => {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toContain('Expected a valid email');
        expect(err.message).toContain('1');
      }),
      getUser({}, { email: 'not an email' }, validContext).catch(err => {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toContain('Expected a valid email');
        expect(err.message).toContain('not an email');
      }),
      getUser({}, { email: ['nope'] }, validContext).catch(err => {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toContain('Expected a valid email');
        expect(err.message).toContain('["nope"]');
      }),
      getUser({}, { email: { email: false } }, validContext).catch(err => {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toContain('Expected a valid email');
        expect(err.message).toContain('false');
      }),
      getUser({}, { email: 1 }, validContext).catch(err => {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toContain('Expected a valid email');
        expect(err.message).toContain('1');
      })
    ]).then(() => {
      done();
    });
  });
});
