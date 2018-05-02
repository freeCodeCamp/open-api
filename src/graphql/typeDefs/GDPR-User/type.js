/*

  All Properties of the user model should be included here

*/

export default `

  type GDPRUser {
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
`;
