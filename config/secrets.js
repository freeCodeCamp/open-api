require("dotenv").config();

const { MONGODB_URL, GRAPHQL_ENDPOINT_URL } = process.env;

exports.getSecret = () => ({
  MONGODB_URL,
  GRAPHQL_ENDPOINT_URL
});
