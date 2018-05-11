import { mergeResolvers } from 'merge-graphql-schemas';
import { userResolvers } from './user';
import { userResolvers as GDPRUserResolvers } from './GDPRUser';

export { createDirectives } from './directives';
export default mergeResolvers([userResolvers, GDPRUserResolvers]);
