export default `
type Mutation {
  createUser(_id: ID, name: String, email: String!): User
}
`;
