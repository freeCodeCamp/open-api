/* eslint-disable */

/*

  Function name should be removed for deployment

  uuid is global inside Auth0 Rules

  https://auth0.com/docs/appliance/modules

*/

function addAccountLinkId(user, context, callback) {
  const namespace = 'https://auth-ns.freecodecamp.org/';
  user.app_metadata = user.app_metadata || {};
  user.app_metadata.accountLinkId = user.app_metadata.accountLinkId || uuid();
  context.idToken[namespace + 'accountLinkId'] =
    user.app_metadata.accountLinkId;

  callback(null, user, context);
}
