export default `
type Query {
  getUser(email: String): User @isAuthenticatedOnQuery
}
`;
