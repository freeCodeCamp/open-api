import InputTypes from './input';

export default `

type BaseFile {
  key: String!
  head: String
  tail: String
  path: String
  history: [String]!,
  name: String!
  ext: String!
  contents: String!
  source: String
}

type CompletedChallenge {
  id: String
  files: File
  bucket: String
  completedDate: Int
  numOfAttempts: Int
}

type File {
  indexcss: BaseFile
  indexhtml: BaseFile
  indexjs: BaseFile
  indexjsx: BaseFile
}

type PortfolioItem {
  description: String
  image: String
  title: String
  url: String
}

type Progress {
  calendar: [Int!]!
  streak: Streak!
}

type ProgressTimestamp {
  timestamp: Int!
  completedChallenge: String
}

type Streak {
  longest: Int!
  current: Int!
}

type User {
  email: String!
  progressTimestamps: [ProgressTimestamp]!,
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
  completedChallenges: [CompletedChallenge]!
  portfolio: [PortfolioItem]!
  theme: String
  languageTag: String
}

${InputTypes}

`;
