export default `
type User {
  _id: ID @isAuthenticatedOnField
  email: String @isAuthenticatedOnField
  name: String @isAuthenticatedOnField
}
`;
