import { graphqlLambda, graphiqlLambda } from "apollo-server-lambda";
import lambdaPlayground from "graphql-playground-middleware-lambda";
import { makeExecutableSchema } from "graphql-tools";
import { mergeResolvers, mergeTypes } from "merge-graphql-schemas";
import { userType } from "./types/user";
import { userResolver } from "./resolvers/user";

const types = mergeTypes([userType]);
const solvers = mergeResolvers([userResolver]);
const graphqlSchema = makeExecutableSchema({
  typeDefs: types,
  resolvers: solvers,
  logger: console
});

// Database connection logic lives outside of the handler for performance reasons
const connectToDatabase = require("./db");

const server = require("apollo-server-lambda");

exports.graphqlHandler = function graphqlHandler(event, context, callback) {
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
    output.headers["Access-Control-Allow-Origin"] = "*";
    output.headers["Access-Control-Allow-Credentials"] = true;
    output.headers["Content-Type"] = "application/json";

    callback(error, output);
  }

  const handler = server.graphqlLambda({ schema: graphqlSchema });

  connectToDatabase()
    .then(() => {
      return handler(event, context, callbackFilter);
    })
    .catch(err => {
      console.log("MongoDB connection error: ", err);
      // TODO: return 500?
      process.exit();
    });
};

exports.apiHandler = lambdaPlayground({
  endpoint: process.env.GRAPHQL_ENDPOINT_URL
    ? process.env.GRAPHQL_ENDPOINT_URL
    : "/production/graphql"
});
