const typeDefs = `#graphql

    type User {
        id: ID!
        name: String!
        email: String!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Query {
        users: [User!]!
        me: User
    }

    type Mutation {
        register(
            name: String!
            email: String!
            password: String!
        ): AuthPayload!

        login(
            email: String!
            password: String!
        ): AuthPayload!
    }
`;



export default typeDefs;