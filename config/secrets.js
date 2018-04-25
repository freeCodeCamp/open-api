require('dotenv').config();

const { MONGODB_URL, GRAPHQL_ENDPOINT_URL, JWT_CERT } = process.env;

exports.getSecret = () => ({
  GRAPHQL_ENDPOINT_URL,
  JWT_CERT,
  MONGODB_URL
});
