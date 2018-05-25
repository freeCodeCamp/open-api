import { mergeResolvers } from 'merge-graphql-schemas';

import { userResolvers } from './user';
import { communityEventResolvers } from './communityEvent';

export { createDirectives } from './directives';

export default mergeResolvers([userResolvers, communityEventResolvers]);
