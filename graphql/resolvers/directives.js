import fs from 'fs';
import path from 'path';
import { forEachField } from 'graphql-tools';
import { getArgumentValues } from 'graphql/execution/values';
import jwt from 'jsonwebtoken';
import debug from 'debug';

import { AuthorizationError } from '../errors';

const log = debug('fcc:resolvers:directives');
const certPath = process.cwd() + '/public.pem';
const cert = fs.readFileSync(certPath);

function isAuth(ctx) {
  const token = ctx.headers.authorization;
  if (!token) {
    throw new AuthorizationError({
      message: 'You must supply a JSON Web Token for authorization!'
    });
  }
  try {
    return jwt.verify(token.replace('Bearer ', ''), cert);
  } catch (err) {
    return false;
  }
}

const directiveResolvers = {
  isAuthenticatedOnField: (result, source, args, ctx) =>
    isAuth(ctx) ? result : null,
  isAuthenticatedOnQuery: (result, source, args, ctx) => {
    const hasAuth = isAuth(ctx);
    if (hasAuth) {
      return result;
    }
    throw new AuthorizationError({
      message: `You are not authorized. The required permission was not found.`
    });
  }
};

// Credit: agonbina https://github.com/apollographql/graphql-tools/issues/212
export const attachDirectives = schema => {
  log('attaching directives');
  forEachField(schema, field => {
    const directives = field.astNode.directives;
    log(directives);
    directives.forEach(directive => {
      const directiveName = directive.name.value;
      const resolver = directiveResolvers[directiveName];
      log(directiveName);
      if (resolver) {
        const oldResolve = field.resolve;
        const Directive = schema.getDirective(directiveName);
        const args = getArgumentValues(Directive, directive);

        field.resolve = function() {
          const [source, _, ctx, info] = arguments;
          let promise = oldResolve.call(field, ...arguments);

          const isPrimitive = !(promise instanceof Promise);
          if (isPrimitive) {
            promise = Promise.resolve(promise);
          }

          return promise.then(result =>
            resolver(result, source, args, ctx, info)
          );
        };
      }
    });
  });
};
