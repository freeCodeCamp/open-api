import { graphqlLambda } from 'apollo-server-lambda';
import lambdaPlayground from 'graphql-playground-middleware-lambda';
import { makeExecutableSchema } from 'graphql-tools';
import debug from 'debug';

import typeDefs from './graphql/typeDefs';
import { default as resolvers, createDirectives } from './graphql/resolvers';
import connectToDatabase from './dataLayer';

const log = debug('fcc:handler');

export const graphqlSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
  directiveResolvers: createDirectives(),
  logger: console
});

exports.graphqlHandler = async function graphqlHandler(
  event,
  context,
  callback
) {
  /* eslint-disable max-len */
  /* Cause Lambda to freeze the process and save state data after
  the callback is called. the effect is that new handler invocations
  will be able to re-use the database connection.
  See https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
  and https://www.mongodb.com/blog/post/optimizing-aws-lambda-performance-with-mongodb-atlas-and-nodejs */
  /* eslint-enable max-len */
  context.callbackWaitsForEmptyEventLoop = false;

  function callbackFilter(error, output) {
    if (!output.headers) {
      output.headers = {};
    }
    // eslint-disable-next-line no-param-reassign
    output.headers['Access-Control-Allow-Origin'] = '*';
    output.headers['Access-Control-Allow-Credentials'] = true;
    output.headers['Content-Type'] = 'application/json';

    callback(error, output);
  }

  const handler = graphqlLambda((event, context) => {
    const { headers } = event;
    const { functionName } = context;

    return {
      schema: graphqlSchema,
      context: {
        headers,
        functionName,
        event,
        context
      }
    };
  });

  try {
    await connectToDatabase();
  } catch (err) {
    log('MongoDB connection error: ', err);
    // TODO: return 500?
    /* eslint-disable no-process-exit */
    process.exit();
    /* eslint-enable no-process-exit */
  }

  try {
    JSON.parse(event.body);
  } catch (err) {
    const msg = 'Invalid JSON';
    log(msg, err);
    return callback(null, {
      body: msg,
      statusCode: 422
    });
  }

  return handler(event, context, callbackFilter);
};

exports.apiHandler = lambdaPlayground({
  endpoint: process.env.GRAPHQL_ENDPOINT_URL
    ? process.env.GRAPHQL_ENDPOINT_URL
    : '/production/graphql'
});
