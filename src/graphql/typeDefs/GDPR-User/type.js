/*

  All Properties of the user model should be included here

*/

export default `

  type GDPRUser {
    accountLinkId: String!
    email: String!
    newEmail: String
    emailVerifyTTL: Int
    emailVerified: Boolean
    emailAuthLinkTTL: Int
    progressTimestamps: [ProgressTimestamp]!
    isBanned: Boolean
    isCheater: Boolean
    githubURL: String
    website: String
    username: String
    bio: String
    about: String
    name: String
    location: String
    picture: String
    linkedin: String
    codepen: String
    twitter: String
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
    portfolio: [PortfolioItem]!
    rand: Float
    timezone: String
    theme: String
    languageTag: String
  }
`;
