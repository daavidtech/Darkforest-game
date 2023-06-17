import { makeExecutableSchema } from '@graphql-tools/schema'

const typeDefinitions = /* GraphQL */ `
  type Quary {
    username: String!
    password: String!
  }
`

const resolvers = {
   Mutation: {
    username: () => ' ',
    password: () => ' '
    }
  }



  export const schema = makeExecutableSchema({
    resolvers: [resolvers],
    typeDefs:[typeDefinitions]
  })