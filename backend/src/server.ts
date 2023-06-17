import { error } from 'console'
import { createSchema, createYoga } from 'graphql-yoga'
import { createServer } from 'http'

const database: any ={
  users:[
   

]

}

const yoga = createYoga({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      
      type User {
        email: String!
        username: String!
      }
      
      type Query {
        email: String!
        username: String!
      }
      
      type Mutation {
        register(email: String!, username: String!, password: String!): User
        login(username: String!, password: String!): User
      }
    `,
    resolvers: {
      Mutation: {
        login: (root, args) =>{
          
         

         const user = database.users.find(user => user.username === args.username && user.password === args.password )
        console.log(user)
         
        if(user === null){
          throw new Error("user not found !")
         }
          
         return user
         
        },
        register: (root, args) => {
          const user ={
            email:args.email,
            username:args.username,
            password:args.password
            
          };
          console.log(user)
          database.users.push(user)
        } 
        
      }
    }
  })
})

const server = createServer(yoga)

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})


