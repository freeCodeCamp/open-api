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
```sh
yarn install              # Install dependencies
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

#
#   A whole bunch of webpack stuff
#
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

Configure your AWS credentials, see https://serverless.com/framework/docs/providers/aws/guide/credentials

Ensure that you have the `serverless` package install globally

```sh
yarn add -g serverless
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
