const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  accountLinkId: {
    type: 'string',
    description: 'A uuid used to link SSO and freeCodeCamp accounts together',
    required: true
  },
  email: {
    type: 'string'
  },
  newEmail: {
    type: 'string'
  },
  emailVerifyTTL: {
    type: 'date'
  },
  emailVerified: {
    type: 'boolean',
    default: false
  },
  emailAuthLinkTTL: {
    type: 'date'
  },
  progressTimestamps: {
    type: 'array',
    default: []
  },
  isBanned: {
    type: 'boolean',
    description: 'User is banned from posting to camper news',
    default: false
  },
  isCheater: {
    type: 'boolean',
    description:
      'Users who are confirmed to have broken academic honesty policy are ' +
      'marked as cheaters',
    default: false
  },
  githubURL: {
    type: 'string'
  },
  website: {
    type: 'string'
  },
  username: {
    type: 'string'
  },
  bio: {
    type: 'string',
    default: ''
  },
  about: {
    type: 'string',
    default: ''
  },
  name: {
    type: 'string',
    default: ''
  },
  location: {
    type: 'string',
    default: ''
  },
  picture: {
    type: 'string',
    default: ''
  },
  linkedin: {
    type: 'string'
  },
  codepen: {
    type: 'string'
  },
  twitter: {
    type: 'string'
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
  isChallengeMapMigrated: {
    type: 'boolean',
    description: 'Migrate completedChallenges array to challenge map',
    default: false
  },
  completedChallenges: {
    type: [
      {
        completedDate: 'number',
        numOfAttempts: 'number',
        id: 'string',
        files: 'object',
        bucket: 'string'
      }
    ],
    default: []
  },
  portfolio: {
    type: 'array',
    default: []
  },
  rand: {
    type: 'number',
    index: true
  },
  timezone: {
    type: 'string'
  },
  theme: {
    type: 'string',
    default: 'default'
  },
  languageTag: {
    type: 'string',
    description: 'An IETF language tag',
    default: 'en'
  }
});

module.exports = mongoose.model('User', userSchema);
