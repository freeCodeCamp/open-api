/* eslint-disable */

/*

  Function name should be removed for deployment

  uuid is global inside Auth0 Rules

  https://auth0.com/docs/appliance/modules

*/

function addAccountLinkId(user, context, callback) {
  const namespace = 'https://www.freecodecamp.org/accountLinkId';
  user.app_metadata = user.app_metadata || {};
  user.app_metadata.accountLinkId = user.app_metadata.accountLinkId || uuid();
  context.idToken[namespace] = user.app_metadata.accountLinkId;

  callback(null, user, context);
}
