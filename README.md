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

## Contributing

We welcome pull requests 🎉! Please follow [these steps](.github/CONTRIBUTING.md) to contribute.

### Deployment

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

### Getting an API key

TBD

## License

Copyright (c) 2018 freeCodeCamp.

The computer software in this repository is licensed under the [BSD-3-Clause](./LICENSE).
