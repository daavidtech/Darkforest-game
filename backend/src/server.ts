import { error } from 'console'
import { createSchema, createYoga } from 'graphql-yoga'
import { createServer } from 'http'

const database: any ={
  users:[{
    email:"apina"
  }
   

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
          
         console.log(args)
         console.log(database)

         const user = database.users.find(user => user.username === args.username && user.password === args.password )
        console.log(user)
         
        if(user == null){
          
          throw new Error("user not found !")
          
         }
          
         return user
         
        },
        register: (root, args) => {
          const newuser ={
            email:args.email,
            username:args.username,
            password:args.password
            
          };
          const user = database.users.find(user => user.username === args.username || user.email === args.email)
          

          if(user == null){

            database.users.push(newuser)


          }else{
            throw new Error("username or email is taken !")
          }
          
         
          
        } 
        
      }
    }
  })
})

const server = createServer(yoga)

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})


