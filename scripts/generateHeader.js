const secrets = require('../src/config/secrets.js');
const jwt = require('jsonwebtoken');

const JWT_CERT = secrets.getSecret().JWT_CERT;

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
