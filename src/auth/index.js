import jwt from 'jsonwebtoken';
import debug from 'debug';

import { AuthorizationError } from '../graphql/errors';

const log = debug('fcc:auth');
const jwtEncoded = process.env.JWT_CERT;
const JWT_CERT = Buffer.from(jwtEncoded, 'base64').toString('utf8');

export { updateAppMetaData } from './auth0';

export const namespace = 'https://auth-ns.freecodecamp.org/';

export const getTokenFromContext = ctx =>
  ctx &&
  ctx.headers &&
  (ctx.headers.authorization || ctx.headers.Authorization);

export function verifyWebToken(ctx) {
  log('Verifying token');
  const token = getTokenFromContext(ctx);
  if (!token) {
    throw new AuthorizationError({
      message:
        'You must supply a JSON Web Token for authorization, are you logged in?'
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
