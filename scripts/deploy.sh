#!/bin/bash
set -e

BRANCH=${TRAVIS_BRANCH:-$(git rev-parse --abbrev-ref HEAD)}

if [[ $BRANCH == 'master' ]]; then
  STAGE="prod"
  export AUTH0_CLIENT_ID=$AUTH0_CLIENT_ID_PROD
  export AUTH0_CLIENT_SECRET=$AUTH0_CLIENT_SECRET_PROD
  export AUTH0_NAMESPACE=$AUTH0_NAMESPACE_PROD
  export GRAPHQL_ENDPOINT_URL=$GRAPHQL_ENDPOINT_URL_PROD
  export JWT_CERT=$JWT_CERT_PROD
  export MONGODB_URL=$MONGODB_URL_PROD
elif [[ $BRANCH == 'staging' ]]; then
  STAGE="stage"
  export AUTH0_CLIENT_ID=$AUTH0_CLIENT_ID_STAGE
  export AUTH0_CLIENT_SECRET=$AUTH0_CLIENT_SECRET_STAGE
  export AUTH0_NAMESPACE=$AUTH0_NAMESPACE_STAGE
  export GRAPHQL_ENDPOINT_URL=$GRAPHQL_ENDPOINT_URL_STAGE
  export JWT_CERT=$JWT_CERT_STAGE
  export MONGODB_URL=$MONGODB_URL_STAGE
fi

if [ -z ${STAGE+x} ]; then
  echo "Only deploying for staging or production branches"
  exit 0
fi

if [[ $STAGE != 'stage' ]]; then
  echo "Only stage deployments for now, sorry!"
  exit 0
fi


echo "Deploying from branch $BRANCH to stage $STAGE"
yarn prepare-production
sls deploy --stage $STAGE --region $AWS_REGION
