export default `
type Mutation {
  createUser: User @isAuthenticatedOnQuery
}
`;
