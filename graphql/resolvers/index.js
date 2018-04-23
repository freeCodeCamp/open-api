import { mergeResolvers } from 'merge-graphql-schemas';
import { userResolvers } from './user';

export { attachDirectives } from './directives';
export default mergeResolvers([userResolvers]);
