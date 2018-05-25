// TODO: date should be a custom type
export default `
type Mutation {
  createCommunityEvent(title: String!
              title: String!       
              description: String!
              attendees: [UserInput]
              date: String!
              imageUrl: String
              isLocked: Boolean): CommunityEvent @isAuthenticatedOnQuery
  deleteCommunityEvent(externalId: String!): CommunityEvent @isAuthenticatedOnQuery
}
`;
