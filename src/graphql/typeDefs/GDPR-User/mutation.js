// TODO(Bouncey): Not active yet, requires implementation

export default `
type Mutation {
  deleteGDPRUser(accountLinkId: String!): HTTPStatus! @isAuthenticatedOnQuery
}
`;
