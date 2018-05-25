export default `
type Query {
  getCommunityEvent(externalId: String
                    title: String): CommunityEvent,
  getCommunityEvents(externalId: String
                    title: String): [CommunityEvent]
}
`;
