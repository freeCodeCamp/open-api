const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  externalId: {
    type: 'string',
    description: 'A UUID that is communicated externally'
  },
  accountLinkId: {
    type: 'string',
    description: 'A uuid used to link SSO and freeCodeCamp accounts together',
    required: true
  },
  email: {
    type: 'string'
  },
  isCheater: {
    type: 'boolean',
    description:
      'Users who are confirmed to have broken academic honesty policy are ' +
      'marked as cheaters',
    default: false
  },
  username: {
    type: 'string'
  },
  name: {
    type: 'string',
    default: ''
  },
  sendQuincyEmail: {
    type: 'boolean',
    default: true
  },
  isLocked: {
    type: 'boolean',
    description:
      'Campers profile does not show challenges/certificates to the public',
    default: true
  },
  currentChallengeId: {
    type: 'string',
    description: 'The challenge last visited by the user',
    default: ''
  },
  isHonest: {
    type: 'boolean',
    description: 'Camper has signed academic honesty policy',
    default: false
  },
  isFrontEndCert: {
    type: 'boolean',
    description: 'Camper is front end certified',
    default: false
  },
  isDataVisCert: {
    type: 'boolean',
    description: 'Camper is data visualization certified',
    default: false
  },
  isBackEndCert: {
    type: 'boolean',
    description: 'Campers is back end certified',
    default: false
  },
  isFullStackCert: {
    type: 'boolean',
    description: 'Campers is full stack certified',
    default: false
  },
  isRespWebDesignCert: {
    type: 'boolean',
    description: 'Camper is responsive web design certified',
    default: false
  },
  is2018DataVisCert: {
    type: 'boolean',
    description: 'Camper is data visualization certified (2018)',
    default: false
  },
  isFrontEndLibsCert: {
    type: 'boolean',
    description: 'Camper is front end libraries certified',
    default: false
  },
  isJsAlgoDataStructCert: {
    type: 'boolean',
    description:
      'Camper is javascript algorithms and data structures certified',
    default: false
  },
  isApisMicroservicesCert: {
    type: 'boolean',
    description: 'Camper is apis and microservices certified',
    default: false
  },
  isInfosecQaCert: {
    type: 'boolean',
    description:
      'Camper is information security and quality assurance certified',
    default: false
  },
  completedChallenges: {
    type: [
      {
        completedDate: 'number',
        id: 'string',
        solution: 'string',
        githubLink: 'string'
      }
    ],
    default: []
  },
  theme: {
    type: 'string',
    default: 'default'
  },
  // Many to many relationship, see
  // http://mongoosejs.com/docs/populate.html
  events: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Event',
      description: 'Event'
    }
  ]
});

module.exports = mongoose.model('User', userSchema, 'user');
