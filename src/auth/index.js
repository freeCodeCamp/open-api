import jwt from 'jsonwebtoken';
import debug from 'debug';

import { AuthorizationError } from '../graphql/errors';

const log = debug('fcc:auth');
const { JWT_CERT } = process.env;

export function verifyWebToken(ctx) {
  log('Verifying token');
  const token =
    ctx &&
    ctx.headers &&
    (ctx.headers.authorization || ctx.headers.Authorization);
  if (!token) {
    throw new AuthorizationError({
      message: 'You must supply a JSON Web Token for authorization!'
    });
  }
  let decoded = null;
  let error = null;
  try {
    decoded = jwt.verify(token.replace('Bearer ', ''), JWT_CERT);
  } catch (err) {
    error = err;
  } finally {
    return { decoded, error, isAuth: !!decoded };
  }
}
