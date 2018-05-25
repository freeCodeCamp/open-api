import InputTypes from './input';

export default `
type CommunityEvent {
  externalId: String
  title: String!
  description: String!
  owner: User!
  attendees: [User]
  date: String!
  imageUrl: String
}

${InputTypes}

`;
