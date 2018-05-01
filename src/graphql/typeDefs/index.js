import { mergeTypes } from 'merge-graphql-schemas';
import User from './User';
import GDPRUser from './GDPR-User';
import HTTPStatus from './HTTPStatus';
import directives from './directives';

export default mergeTypes([User, GDPRUser, HTTPStatus, directives]);
