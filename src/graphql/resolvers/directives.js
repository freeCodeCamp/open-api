import { AuthorizationError } from '../errors';
import { verifyWebToken as _verifyWebToken } from '../../auth';
import { asyncErrorHandler } from '../../utils';

/*
  Interface: {
    Directive: (
      next: Resolver <Promise>
      source: any <From Data Source>, Example <User Object>
      args: any, passed to directive
      ctx: Lambda context <Object>
    ) => <Promise> | <Error>
  }
*/

export const createDirectives = (verifyWebToken = _verifyWebToken) => ({
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
});
