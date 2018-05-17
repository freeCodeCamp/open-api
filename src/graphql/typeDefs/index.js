import { mergeTypes } from 'merge-graphql-schemas';
import User from './User';
import directives from './directives';

export default mergeTypes([User, directives]);
