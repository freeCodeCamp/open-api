import validator from 'validator';
import UserModel from '../model/user.js';
import debug from 'debug';

import { asyncErrorHandler } from '../../utils';

const log = debug('fcc:dataLayer:mongo:user');

function doesExist(Model, options) {
  return Model.find(options).exec();
}

export function getUsers(_, args = {}) {
  return new Promise((resolve, reject) => {
    UserModel.find(args)
      .then(users => {
        let userMap = [];
        users.forEach((user, index) => {
          userMap[index] = user;
        });
        let res = {};
        res.users = userMap;
        resolve(res.users);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export async function createUser(email) {
  const isEmail = validator.isEmail(email);
  if (!isEmail) {
    throw new Error('You must provide a vaild email');
  }
  const entities = await asyncErrorHandler(doesExist(UserModel, { email }));
  const exists = !!entities.length;
  if (exists) {
    throw new Error(`An account with the email ${email} already exists`);
  }
  const newUser = await asyncErrorHandler(
    UserModel.create({ email }),
    'Something went wrong creating your account, please try again'
  );
  return newUser;
}
