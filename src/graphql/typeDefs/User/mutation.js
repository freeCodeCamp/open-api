export default `
type Mutation {
  createUser: User @isAuthenticatedOnQuery
  deleteUser(accountLinkId: String!): User @isAuthenticatedOnQuery
}
`;
