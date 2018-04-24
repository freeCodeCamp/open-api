import { graphqlLambda, graphiqlLambda } from 'apollo-server-lambda';
import lambdaPlayground from 'graphql-playground-middleware-lambda';
import { makeExecutableSchema } from 'graphql-tools';
import debug from 'debug';

import typeDefs from './graphql/typeDefs';
import { default as resolvers, directiveResolvers } from './graphql/resolvers';

const log = debug('fcc:handler');

export const graphqlSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
  directiveResolvers,
  logger: console
});

// Database connection logic lives outside of the handler for performance reasons
const connectToDatabase = require('./dataLayer');

const server = require('apollo-server-lambda');

export async function graphqlHandler(event, context, callback) {
  /* Cause Lambda to freeze the process and save state data after
  the callback is called the effect is that new handler invocations
  will be able to re-use the database connection.
  See https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
  and https://www.mongodb.com/blog/post/optimizing-aws-lambda-performance-with-mongodb-atlas-and-nodejs */
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

  const handler = server.graphqlLambda((event, context) => {
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
    process.exit();
  }
  return handler(event, context, callbackFilter);
}

export const apiHandler = lambdaPlayground({
  endpoint: process.env.GRAPHQL_ENDPOINT_URL
    ? process.env.GRAPHQL_ENDPOINT_URL
    : '/production/graphql'
});
