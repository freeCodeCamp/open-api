import fs from 'fs';
import path from 'path';
import { forEachField } from 'graphql-tools';
import { getArgumentValues } from 'graphql/execution/values';
import jwt from 'jsonwebtoken';
import debug from 'debug';

import { AuthorizationError } from '../errors';
import { asyncErrorHandler } from '../../utils';

const log = debug('fcc:resolvers:directives');
const certPath = process.cwd() + '/public.pem';
const cert = fs.readFileSync(certPath);

function verifyWebToken(ctx) {
  const token = ctx.headers.authorization;
  if (!token) {
    throw new AuthorizationError({
      message: 'You must supply a JSON Web Token for authorization!'
    });
  }
  let decoded = null;
  let error = null;
  try {
    decoded = jwt.verify(token.replace('Bearer ', ''), cert);
  } catch (err) {
    error = err;
  } finally {
    return { decoded, error, isAuth: !!decoded };
  }
}

/*
  Interface: {
    Directive: (
      next: QueryResolver <Promise>
      source: any <From Data Source>, Example <User Object>
      args: any, passed to directive
      ctx: Lambda context <Object>
    ) => <Promise> | <Error>
  }
*/
export const directiveResolvers = {
  isAuthenticatedOnField: (next, source, args, ctx) => {
    const { isAuth } = verifyWebToken(ctx);
    return asyncErrorHandler(next().then(result => (isAuth ? result : null)));
  },
  isAuthenticatedOnQuery: (next, source, args, ctx) => {
    const { isAuth, error } = verifyWebToken(ctx);
    if (isAuth) {
      return asyncErrorHandler(next());
    }
    throw new AuthorizationError({
      message: `You are not authorized, ${error.message}`
    });
  }
};
