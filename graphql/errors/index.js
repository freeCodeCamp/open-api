import { createError } from 'apollo-errors';

export const AuthorizationError = createError('AuthorizationError', {
  message: 'You are not authorized.'
});
