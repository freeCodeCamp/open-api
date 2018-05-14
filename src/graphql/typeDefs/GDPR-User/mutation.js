export default `
type Mutation {
  deleteUser(accountLinkId: String!): GDPRUser @isAuthenticatedOnQuery
}
`;
