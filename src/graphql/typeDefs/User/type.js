import InputTypes from './input';

export default `

type CompletedChallenge {
  completedDate: Int!,
  id: String!,
  solution: String,
  githubLink: String
}

type User {
  externalId: String
  accountLinkId: String!
  email: String!
  isCheater: Boolean
  username: String
  name: String
  sendQuincyEmail: Boolean
  isLocked: Boolean
  currentChallengeId: String
  isHonest: Boolean
  isFrontEndCert: Boolean
  isDataVisCert: Boolean
  isBackEndCert: Boolean
  isFullStackCert: Boolean
  isRespWebDesignCert: Boolean
  is2018DataVisCert: Boolean
  isFrontEndLibsCert: Boolean
  isJsAlgoDataStructCert: Boolean
  isApisMicroservicesCert: Boolean
  isInfosecQaCert: Boolean
  isChallengeMapMigrated: Boolean
  completedChallenges: [CompletedChallenge]!
  theme: String
}

${InputTypes}

`;
