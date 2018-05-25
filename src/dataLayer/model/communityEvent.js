const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const communityEventSchema = new Schema({
  externalId: {
    type: 'string',
    description: 'Unique ID to refers to events externally',
    required: true
  },
  title: {
    type: 'string',
    required: true
  },
  description: {
    type: 'string',
    required: true
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    description: 'ID of owner of event',
    required: true
  },
  // Many to many relationship, see
  // http://mongoosejs.com/docs/populate.html
  attendees: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      description: 'Attendee'
    }
  ],

  date: {
    type: 'date',
    required: true
  },
  imageUrl: {
    type: 'string'
  },
  isLocked: {
    type: 'boolean',
    description: 'Event is locked',
    default: true
  }
});

module.exports = mongoose.model(
  'CommunityEvent',
  communityEventSchema,
  'communityEvent'
);
