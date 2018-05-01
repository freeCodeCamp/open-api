export default `
input ChallengeMapUpdate {
  id: String
  files: FileInput
  completedDate: Float
  numOfAttempts: Int
}
input FileInput {
  indexcss: BaseFileInput
  indexhtml: BaseFileInput
  indexjs: BaseFileInput
  indexjsx: BaseFileInput
}
input BaseFileInput {
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
`;
