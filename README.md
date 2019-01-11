![freeCodeCamp](https://camo.githubusercontent.com/60c67cf9ac2db30d478d21755289c423e1f985c6/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f66726565636f646563616d702f776964652d736f6369616c2d62616e6e65722e706e67)

[![Gitter](https://badges.gitter.im/FreeCodeCamp/open-api.svg)](https://gitter.im/FreeCodeCamp/open-api?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Build Status](https://travis-ci.org/freeCodeCamp/open-api.svg?branch=staging)](https://travis-ci.org/freeCodeCamp/open-api)
[![Known Vulnerabilities](https://snyk.io/test/github/freecodecamp/open-api/badge.svg?targetFile=package.json)](https://snyk.io/test/github/freecodecamp/open-api?targetFile=package.json)

# open-api

**This project is currently being refactored, performance and API will be unstable.**

## About

open-api is a graphQL API that will serve multiple purposes:

* serve the frontend of freeCodeCamp
* an implementation of the freeCodeCamp's open-data policy
* allow developers to build applications around the freeCodeCamp's eco-system and its open data sets

## Urls

| environment | url | method |
 ------- | --- | ---|
| staging     | https://hxtsoafqna.execute-api.us-east-1.amazonaws.com/stage/api | GET | 
| staging     | https://hxtsoafqna.execute-api.us-east-1.amazonaws.com/stage/graphql | POST |
| production | 
| production | 

## Contributing

We welcome pull requests 🎉! Please follow [these steps](.github/CONTRIBUTING.md) to contribute.

## Updating certificates

Tokens are verified using public keys, each tenant will have their own certificate containing the public key.

Certificates are stored either on developer laptops in .env files, or in an environment variable
JWT_CERT for deployments. We use Travis for deployments, and `scripts/deploy.sh`
will pick either JWT_CERT_STAGE or JWT_CERT_PROD and export it as JWT_CERT. This
will be picked up and deployed by Serverless.

Certificates are base64 encoded to prevent encoding issues. This works around the
fact that Travis uses Bash to export environment variables, which causes issues
with newlines and other characters have a special meaning in shells.

To add a new certificate, download it as a .pem file, and base64 encode it. Use `yarn encode-file` if you want a
convenient script:

```bash
▶ yarn encode-file ~/Downloads/freecodecamp-dev.pem
yarn run v1.6.0
$ node scripts/base64encode.js /Users/ojongerius/Downloads/freecodecamp-dev.pem
Original contents:

-----BEGIN CERTIFICATE-----
MIIDDzCCAfegAwIBAgIJGHAmUeq9oGcAMA0GCSqGSIb3DQEBCwUAMCUxIzAhBgNV
<SNIP>
zIPPbMj9c6D7tETg2ZeHEthScPsgoPSHXxYu5N9ImoY/KLjDD5Nk364e0M+ZT8rF
rbgxgxHNJH92enBwsqrq7CWi2Q==
-----END CERTIFICATE-----

Base64 encoded (copy this):

LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tDQpNSUlERHpDQ0FmZWdBd0lCQWdJSkdIQW1VZXE5b0djQU1B
<SNIP>
MzY0ZTBNK1pUOHJGDQpyYmd4Z3hITkpIOTJlbkJ3c3FycTdDV2kyUT09DQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tDQo=
✨  Done in 0.23s.
```

And copy the base64 encoded string to your destination.

## Deployment

Deployment is normally done by CI.

### Manual Deployment

If you want to do a manual deployment:

Configure your AWS credentials, see <https://serverless.com/framework/docs/providers/aws/guide/credentials>

Ensure that you have the `serverless` package install globally

```sh
yarn global add serverless
```

Assert that the stages configured in `serverless.yml` in line with what you'd like to deploy to, and run:

```sh
serverless --stage=YOUR_STAGE_HERE deploy
```

## Getting an API key

TBD

## License

Copyright (c) 2018 freeCodeCamp.

The computer software in this repository is licensed under the [BSD-3-Clause](./LICENSE).
