const secrets = require('../src/config/secrets.js');
const jwt = require('jsonwebtoken');

const jwtEncoded = secrets;
const JWT_CERT = Buffer.from(jwtEncoded, 'base64').toString('utf8');

const token = jwt.sign(
  {
    id: 123,
    name: 'Charlie',
    email: 'charlie@thebear.me'
  },
  JWT_CERT
);
const headers = '{"Authorization": "Bearer ' + token + '"}';

console.log(headers);
