export default `
type Mutation {
  deleteGDPRUser(accountLinkId: String!): HTTPStatus! @isAuthenticatedOnQuery
}
`;
