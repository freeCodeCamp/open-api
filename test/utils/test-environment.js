const jwt = require('jsonwebtoken');

const { JWT_CERT } = process.env;

const NodeEnvironment = require('jest-environment-node');

class MongoEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    this.global.__MONGO_URI__ = await global.__MONGOD__.getConnectionString();
    this.global.__MONGO_DB_NAME__ = global.__MONGO_DB_NAME__;

    const token = jwt.sign({ id: 123, name: 'Charlie' }, JWT_CERT);
    const headers = {
      'Content-Type': 'application/json'
    };

    this.global.mockedContextWithOutToken = { headers: headers };

    const headersWithValidToken = {
      ...headers,
      authorization: 'Bearer ' + token
    };
    this.global.mockedContextWithValidToken = {
      headers: headersWithValidToken
    };

    const headersWithInValidToken = {
      ...headers,
      authorization: 'Bearer 123'
    };
    this.global.mockedContextWithInValidToken = {
      headers: headersWithInValidToken
    };

    await super.setup();
  }

  async teardown() {
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = MongoEnvironment;
