![freeCodeCamp](https://camo.githubusercontent.com/60c67cf9ac2db30d478d21755289c423e1f985c6/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f66726565636f646563616d702f776964652d736f6369616c2d62616e6e65722e706e67)

[![Gitter](https://badges.gitter.im/FreeCodeCamp/open-api.svg)](https://gitter.im/FreeCodeCamp/open-api?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Build Status](https://travis-ci.org/freeCodeCamp/open-api.svg?branch=staging)](https://travis-ci.org/freeCodeCamp/open-api)
[![Known Vulnerabilities](https://snyk.io/test/github/freecodecamp/open-api/badge.svg?targetFile=package.json)](https://snyk.io/test/github/freecodecamp/open-api?targetFile=package.json)

# open-api

**This project is currently being refactored, performance and API will be unstable.**

## About

freeCodeCamp's open API initiative is an implementation of the freeCodeCamp's open-data policy. This project aims to open access to developers for building applications around the freeCodeCamp's eco-system and its open data sets.

## Setting up of a development environment
### Install prerequisites

Install dependencies

Prerequisites:
1. [Yarn](https://yarnpkg.com/en/docs/install)
2. [Node.js](https://nodejs.org/en/)
3. [Docker](https://docs.docker.com/install/)

```sh
yarn                      # Install dependencies
docker pull lambci/lambda # Pull Docker image used to simulate an AWS Lambda container
```

### Configuring your environment

```sh
cp sample.env .env
```

### Running the service
Start running locally using:

```sh
yarn start

> open-api@0.0.1 start /Users/ojongerius/repos/fcc-open-api
> serverless offline start --skipCacheInvalidation

Serverless: Bundling with Webpack...
Time: 891ms
Built at: 2018-4-18 11:41:34
         Asset      Size   Chunks             Chunk Names
    handler.js  18.2 KiB  handler  [emitted]  handler
handler.js.map  22.1 KiB  handler  [emitted]  handler
Entrypoint handler = handler.js handler.js.map
[./db.js] 593 bytes {handler} [built]
[./handler.js] 1.98 KiB {handler} [built]
[./model/user.js] 4.97 KiB {handler} [built]
[./mongo/user.js] 986 bytes {handler} [built]
[./resolvers/user.js] 210 bytes {handler} [built]
[./types/user.js] 388 bytes {handler} [built]
[apollo-server-lambda] external "apollo-server-lambda" 42 bytes {handler} [built]
[bluebird] external "bluebird" 42 bytes {handler} [built]
[fs] external "fs" 42 bytes {handler} [built]
[graphql-playground-middleware-lambda] external "graphql-playground-middleware-lambda" 42 bytes {handler} [built]
[graphql-tools] external "graphql-tools" 42 bytes {handler} [built]
[merge-graphql-schemas] external "merge-graphql-schemas" 42 bytes {handler} [built]
[moment] external "moment" 42 bytes {handler} [built]
[mongoose] external "mongoose" 42 bytes {handler} [built]
[validator] external "validator" 42 bytes {handler} [built]
Serverless: Watching for changes...
Serverless: Starting Offline: dev/us-east-1.

Serverless: Routes for graphql:
Serverless: POST /graphql

Serverless: Routes for api:
Serverless: GET /api

Serverless: Offline listening on http://localhost:4000
```

### Deployment
Deployment is normally done by CI.

### Manual Deployment

If you want to do a manual deployment:

Configure your AWS credentials, see <https://serverless.com/framework/docs/providers/aws/guide/credentials>

Ensure that you have the `serverless` package install globally

```sh
npm i -g serverless
```

Assert that the stages configured in `serverless.yml` in line with what you'd like to deploy to, and run:

```sh
serverless --stage=YOUR_STAGE_HERE deploy
```

### Getting an API key

TBD

## License

Copyright (c) 2018 freeCodeCamp.

The computer software in this repository is licensed under the [BSD-3-Clause](./LICENSE).
