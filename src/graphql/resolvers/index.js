import { mergeResolvers } from 'merge-graphql-schemas';
import { userResolvers } from './user';

export { createDirectives } from './directives';
export default mergeResolvers([userResolvers]);
