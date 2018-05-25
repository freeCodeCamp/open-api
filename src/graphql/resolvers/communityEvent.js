import {
  getCommunityEvent,
  getCommunityEvents,
  createCommunityEvent,
  deleteCommunityEvent
} from '../../dataLayer/mongo/communityEvent';

export const communityEventResolvers = {
  Query: {
    getCommunityEvent,
    getCommunityEvents
  },
  Mutation: {
    createCommunityEvent,
    deleteCommunityEvent
  }
};
