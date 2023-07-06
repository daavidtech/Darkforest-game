import { error } from 'console'
import { createSchema, createYoga } from 'graphql-yoga'
import { createServer } from 'http'
const jwt = require('jsonwebtoken');

const secretKey = 'yourSecretKey';

const database: any ={
  users:[{
    
  }
   

]

}





const yoga = createYoga({
	context: req => {
	 	const token = req.request.headers.get("authorization")
		
		let user

		if (token) {
			try {
				const decoded = jwt.verify(token, secretKey)
				console.log("decoded token", decoded)
				user = decoded
			} catch(err) {
				console.log(err)
			}
		}

		return {
			user: user
		}
	},

  schema: createSchema({
    typeDefs: /* GraphQL */ `
      
      type User {
        email: String!
        username: String!
      }

	  type Viewer {
		user: User
	  }

      type LoginResponse {
        token: String!
        viewer: Viewer!
      }
      
      type Query {
        email: String!
        username: String!
		viewer: Viewer!
      }
      
      type Mutation {
        register(email: String!, username: String!, password: String!): User
        login(username: String!, password: String!): LoginResponse!
      }
    `,
   resolvers: {
	  Query: {
		viewer: (root, args, ctx: any) => {
			return {
				user: ctx.user
			}
		}
	  },
      Mutation: {
        login: (root, args) =>{
          
         console.log(args)
         console.log(database)

         const user = database.users.find(user => user.username === args.username && user.password === args.password )
        console.log(user)

        const token = jwt.sign(user, secretKey, { expiresIn: '1h' });

        console.log('Generated JWT token:', token);

         return {
			token: token,
			viewer: {
				user: user
			}
		 }
         
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


