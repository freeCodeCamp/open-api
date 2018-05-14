// TODO(Bouncey): Not active yet, requires implementation

export default `
type Mutation {
  deleteUser(accountLinkId: String!): GDPRUser @isAuthenticatedOnQuery
}
`;
