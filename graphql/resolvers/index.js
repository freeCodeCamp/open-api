import { mergeResolvers } from "merge-graphql-schemas";
import { userResolvers } from "./user";

export default mergeResolvers([userResolvers]);
