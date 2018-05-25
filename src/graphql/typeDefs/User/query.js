export default `
type Query {
  getUser(email: String
          externalId: String
  ): User @isAuthenticatedOnQuery
}
`;
