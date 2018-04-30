const jwt = require('jsonwebtoken');
const { JWT_CERT } = process.env;

const token = jwt.sign({ id: 123, name: 'Charlie' }, JWT_CERT);
const headers = '{"Authorization": "Bearer ' + token + '"}';

console.log(headers);
