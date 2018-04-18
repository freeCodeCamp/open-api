export default `
type Query {
  users(
      _id: ID
      name: String
      email: String
  ): [User]
}
`;
