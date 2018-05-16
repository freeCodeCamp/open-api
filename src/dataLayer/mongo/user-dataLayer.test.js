/* global expect beforeAll afterAll */
import { createUser, getUser, deleteUser } from './user';
import UserModel from '../model/user.js';
import { isObject, isEmpty } from 'lodash';
import mongoose from 'mongoose';

const validContextForCharlie = global.mockedContextWithValidTokenForCharlie;
const validContextForLola = global.mockedContextWithValidTokenForLola;
const validContextForJane = global.mockedContextWithValidTokenForJane;

beforeAll(async function beforeAllTests() {
  await mongoose.connect(global.__MONGO_URI__);
});

afterAll(async function afterAllTests() {
  await mongoose.disconnect();
});

describe('createUser', () => {
  it('should return a User object', done => {
    expect.assertions(2);
    createUser({}, {}, validContextForLola)
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

  it('should throw if accountLinkId is already in db', done => {
    expect.assertions(1);
    createUser({}, {}, validContextForLola).catch(err => {
      expect(err).toMatchSnapshot();
      done();
      return;
    });
  });
});

describe('getUser', () => {
  it('should return a User object fo a valid request', done => {
    expect.assertions(2);
    const email = 'lola@cbbc.tv';
    getUser({}, { email }, validContextForLola)
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
    getUser({}, { email }, validContextForCharlie).catch(err => {
      expect(err.message).toContain('No user found for ');
      done();
    });
  });

  it('should throw if the supplied email is not valid', done => {
    expect.assertions(15);
    Promise.all([
      getUser({}, { email: 1 }, validContextForCharlie).catch(err => {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toContain('Expected a valid email');
        expect(err.message).toContain('1');
      }),
      getUser({}, { email: 'not an email' }, validContextForCharlie).catch(
        err => {
          expect(err).toBeInstanceOf(TypeError);
          expect(err.message).toContain('Expected a valid email');
          expect(err.message).toContain('not an email');
        }
      ),
      getUser({}, { email: ['nope'] }, validContextForCharlie).catch(err => {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toContain('Expected a valid email');
        expect(err.message).toContain('["nope"]');
      }),
      getUser({}, { email: { email: false } }, validContextForCharlie).catch(
        err => {
          expect(err).toBeInstanceOf(TypeError);
          expect(err.message).toContain('Expected a valid email');
          expect(err.message).toContain('false');
        }
      ),
      getUser({}, { email: 1 }, validContextForCharlie).catch(err => {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toContain('Expected a valid email');
        expect(err.message).toContain('1');
      })
    ]).then(() => {
      done();
    });
  });
});

describe('deleteUser', () => {
  it('should delete an existing user', async done => {
    const result = await createUser({}, {}, validContextForJane);
    const { accountLinkId } = result;
    const response = await deleteUser(
      {},
      { accountLinkId },
      validContextForJane
    );
    expect(response).toBeTruthy();
    expect(response.accountLinkId).toMatch(accountLinkId);
    const searchResult = await UserModel.findOne({ accountLinkId });
    expect(searchResult).toBe(null);
    done();
  });
  it('should return with an error for a non existing user', async done => {
    try {
      await deleteUser(
        {},
        { accountLinkId: global.idOfLola },
        validContextForLola
      );
    } catch (err) {
      expect(err).toMatchSnapshot();
    }
    done();
  });
  it('should refuse deletion of other users', async done => {
    try {
      await deleteUser(
        {},
        { accountLinkId: global.idOfLola },
        validContextForCharlie
      );
    } catch (err) {
      expect(err).toMatchSnapshot();
    }
    done();
  });
});
