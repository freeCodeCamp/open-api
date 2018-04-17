const userType = `

    type Query {
        users(
            _id: ID
            name: String
            email: String
        ): [User]
    }

    type Mutation {
        createUser(
            _id: ID
            name: String
            email: String
        ): User
    }

    type User {
        _id: ID!
        email: String
        name: String
    }
`;

export { userType };
