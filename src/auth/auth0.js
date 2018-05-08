import axios from 'axios';
import debug from 'debug';

import { asyncErrorHandler } from '../utils';

const log = debug('fcc:auth:auth0');

const { AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_NAMESPACE } = process.env;
/* eslint-disable camelcase */
function getAPIToken() {
  log('requesting machine token');
  const options = {
    method: 'POST',
    url: `${AUTH0_NAMESPACE}/oauth/token`,
    headers: { 'content-type': 'application/json' },
    data: {
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      audience: `${AUTH0_NAMESPACE}/api/v2/`,
      grant_type: 'client_credentials'
    }
  };

  return axios(options)
    .then(response => response.data.access_token)
    .catch(console.error);
}

export async function updateAppMetaData(id, update) {
  const body = { app_metadata: update };
  /* eslint-enable camelcase */
  const token = await asyncErrorHandler(getAPIToken());
  const headers = { Authorization: `Bearer ${token}` };

  const options = {
    method: 'PATCH',
    url: `${AUTH0_NAMESPACE}/api/v2/users/${id}`,
    headers,
    data: body
  };
  log('setting app_metadata');
  return axios(options).catch(console.error);
}
