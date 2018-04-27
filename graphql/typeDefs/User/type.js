export default `
type User {
  _id: ID @isAuthenticatedOnField
  email: String
  name: String
}
`;
