/* global beforeAll afterAll expect */
import mongoose from 'mongoose';
import { graphql } from 'graphql';

import authorization from '../utils/testAuthField';
import { graphqlSchema } from '../../handler';
import UserModel from '../../dataLayer/model/user.js';

// these test require jwt's to work correctly
// ignoring until we have a solution
// issue #81 rasied to address this

beforeAll(async () => {
  await mongoose.connect(global.__MONGO_URI__);
});

afterAll(async () => {
  await mongoose.disconnect();
});

it('should return a user after one has been created', async done => {
  const user = new UserModel({
    name: 'user',
    email: 'user@example.com'
  });

  await user.save();
  const query = `
    query {
        users {
            name
            email
        }
    }
    `;
  const rootValue = {};
  const ctx = { headers: { authorization } };
  graphql(graphqlSchema, query, rootValue, ctx)
    .then(result => {
      console.log(result);
      expect(result.data.users[0].name).toBe(user.name);
      done();
    })
    .catch(err => {
      console.log('Oh no!');
      return done(err);
    });
});
