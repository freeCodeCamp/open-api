import { mergeTypes } from 'merge-graphql-schemas';
import User from './User';
import CommunityEvent from './CommunityEvent';
import directives from './directives';

export default mergeTypes([User, CommunityEvent, directives]);
