const fs = require('fs');

if (process.argv.length < 3) {
  console.log('Please provide filename and path to encode');
  /* eslint-disable no-process-exit */
  process.exit(1);
  /* eslint-enable no-process-exit */
}

const cert = fs.readFileSync(process.argv[2]);

console.log('Original contents: \n\n' + cert);
console.log(
  'Base64 encoded (copy this): \n\n' + Buffer.from(cert).toString('base64')
);
