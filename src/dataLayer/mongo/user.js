import validator from 'validator';
import UserModel from '../model/user.js';
import debug from 'debug';
import uuid from 'uuid/v4';
import { isEmpty, isString } from 'lodash';

import { asyncErrorHandler } from '../../utils';
import { verifyWebToken, namespace, updateAppMetaData } from '../../auth';

const log = debug('fcc:dataLayer:mongo:user');

function doesExist(Model, options) {
  return Model.find(options).exec();
}

export function getUser(root, { email }) {
  return new Promise(async function getUserPromise(resolve, reject) {
    if (!isString(email) || !validator.isEmail(email)) {
      reject(
        new TypeError(`Expected a valid email, got ${JSON.stringify(email)}`)
      );
      return null;
    }
    log(`finding user for ${email}`);
    const found = await UserModel.findOne({ email }).exec();
    log(`found? ${!!found}`);
    if (isEmpty(found)) {
      reject(new Error(`No user found for ${email}`));
      return null;
    }
    return resolve(found);
  });
}

export async function createUser(root, vars, ctx) {
  const { decoded } = verifyWebToken(ctx);
  const { email, name, sub: id } = decoded;
  if (!isString(email) || !validator.isEmail(email)) {
    throw new Error('You must provide a valid email');
  }
  const newUser = { name, email };
  let accountLinkId = decoded[namespace + 'accountLinkId'];
  if (accountLinkId) {
    newUser.accountLinkId = accountLinkId;
  } else {
    accountLinkId = uuid();
    newUser.accountLinkId = accountLinkId;
    updateAppMetaData(id, { accountLinkId });
  }
  const exists = await asyncErrorHandler(
    doesExist(UserModel, { accountLinkId })
  );
  if (isEmpty(exists)) {
    const newAccount = new UserModel(newUser);
    return await asyncErrorHandler(
      newAccount.save(),
      'Something went wrong creating your account, please try again'
    );
  } else {
    throw new Error('Account already in use');
  }
}

export async function deleteUser(root, vars, ctx) {
  const { decoded } = verifyWebToken(ctx);
  const { accountLinkId } = vars;
  const loggedInId = decoded[namespace + 'accountLinkId'];

  if (loggedInId !== accountLinkId) {
    throw new Error('You can delete only your account');
  }
  const removedUser = await UserModel.findOneAndRemove({ accountLinkId });
  if (!removedUser) {
    throw new Error(
      'There is no account with this accountLinkId ' + accountLinkId
    );
  }
  return removedUser;
}
