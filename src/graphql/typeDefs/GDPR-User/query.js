export default `
type Query {
  getGDPRUser(accountLinkId: String!): GDPRUser @isAuthenticatedOnQuery
}
`;
