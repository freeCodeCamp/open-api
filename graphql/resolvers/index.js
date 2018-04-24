import { mergeResolvers } from 'merge-graphql-schemas';
import { userResolvers } from './user';

export { directiveResolvers } from './directives';
export default mergeResolvers([userResolvers]);
