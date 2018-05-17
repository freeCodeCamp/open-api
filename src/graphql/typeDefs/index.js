import { mergeTypes } from 'merge-graphql-schemas';
import User from './User';
import GDPRUser from './GDPR-User';
import directives from './directives';

export default mergeTypes([User, GDPRUser, directives]);
