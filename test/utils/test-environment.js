const jwt = require('jsonwebtoken');
const NodeEnvironment = require('jest-environment-node');

// can be found in ~/src/auth/index.js
// not 'required' due to jest no knowing how to read es6 modules
const namespace = 'https://auth-ns.freecodecamp.org/';

const jwtEncoded = process.env.JWT_CERT;
const JWT_CERT = Buffer.from(jwtEncoded, 'base64').toString('utf8');

class MongoEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    this.global.__MONGO_URI__ = await global.__MONGOD__.getConnectionString();
    this.global.__MONGO_DB_NAME__ = global.__MONGO_DB_NAME__;

    this.global.idOfCharlie = '76b27a04-f537-4f7d-89a9-b469bf81208b';
    this.global.idOfLola = '85a937d5-c82c-4aa9-8e0b-9f2b9a7cc36c';
    this.global.idOfJane = '85a937d5-c82c-4aa9-89a9-b469bf81208b';
    this.global.idOfBrian = 'd57c402c-647a-11e8-a678-14109fd1f8cb';
    this.global.idOfDennis = 'e7189f2e-647a-11e8-9ed9-14109fd1f8cb';
    this.global.idOfKen = 'e4a850da-647b-11e8-9fb2-14109fd1f8cb';

    const token = jwt.sign(
      {
        name: 'Charlie',
        email: 'charlie@thebear.me',
        [namespace + 'accountLinkId']: this.global.idOfCharlie
      },
      JWT_CERT
    );
    const token2 = jwt.sign(
      {
        name: 'Lola',
        email: 'lola@cbbc.tv',
        [namespace + 'accountLinkId']: this.global.idOfLola
      },
      JWT_CERT
    );
    const token3 = jwt.sign(
      {
        name: 'Jane',
        email: 'janedoe@someplace.com',
        [namespace + 'accountLinkId']: this.global.idOfJane
      },
      JWT_CERT
    );
    const tokenWithoutEmail = jwt.sign(
      {
        name: 'Marv',
        [namespace + 'accountLinkId']: 'f0a102f6-4d2a-481b-9256-438c5756ffb5'
      },
      JWT_CERT
    );
    const tokenForBrian = jwt.sign(
      {
        name: 'Brian Kernighan',
        email: 'briankernighan@example.com',
        [namespace + 'accountLinkId']: this.global.idOfBrian
      },
      JWT_CERT
    );

    const tokenForDennis = jwt.sign(
      {
        name: 'Dennis Ritchie',
        email: 'dennisritchie@example.com',
        [namespace + 'accountLinkId']: this.global.idOfDennis
      },
      JWT_CERT
    );

    const tokenForKen = jwt.sign(
      {
        name: 'Ken Thompson',
        email: 'kenthompson@example.com',
        [namespace + 'accountLinkId']: this.global.idOfKen
      },
      JWT_CERT
    );

    const headers = {
      'Content-Type': 'application/json'
    };

    this.global.mockedContextWithOutToken = { headers: headers };

    const headersWithValidTokenForCharlie = {
      ...headers,
      Authorization: 'Bearer ' + token
    };
    this.global.mockedContextWithValidTokenForCharlie = {
      headers: headersWithValidTokenForCharlie
    };

    const headersWithValidTokenForLola = {
      ...headers,
      authorization: 'Bearer ' + token2
    };
    this.global.mockedContextWithValidTokenForLola = {
      headers: headersWithValidTokenForLola
    };

    const headersWithValidTokenForJane = {
      ...headers,
      authorization: 'Bearer ' + token3
    };
    this.global.mockedContextWithValidTokenForJane = {
      headers: headersWithValidTokenForJane
    };

    const headersWithNoEmailToken = {
      ...headers,
      authorization: 'Bearer ' + tokenWithoutEmail
    };
    this.global.mockedContextWithNoEmailToken = {
      headers: headersWithNoEmailToken
    };

    const headersWithInValidToken = {
      ...headers,
      Authorization: 'Bearer 123'
    };
    this.global.mockedContextWithInValidToken = {
      headers: headersWithInValidToken
    };

    const headersWithValidTokenForBrian = {
      ...headers,
      authorization: 'Bearer ' + tokenForBrian
    };
    this.global.mockedContextWithValidTokenForBrian = {
      headers: headersWithValidTokenForBrian
    };

    const headersWithValidTokenForDennis = {
      ...headers,
      authorization: 'Bearer ' + tokenForDennis
    };
    this.global.mockedContextWithValidTokenForDennis = {
      headers: headersWithValidTokenForDennis
    };

    const headersWithValidTokenForKen = {
      ...headers,
      authorization: 'Bearer ' + tokenForKen
    };
    this.global.mockedContextWithValidTokenForKen = {
      headers: headersWithValidTokenForKen
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
