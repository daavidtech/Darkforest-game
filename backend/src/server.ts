import { PrismaClient } from '@prisma/client';
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


const prisma = new PrismaClient()

type Context = {
	prisma: PrismaClient
	user: any
}

const yoga = createYoga({
	context: (req): Context => {
	 	const token = req.request.headers.get("authorization")
		const tokenArray = token.split(" ");
    const actualToken = tokenArray[1];
		let user
    console.log(actualToken)
    console.log("apina")



		if (actualToken) {
			try {
				const decoded = jwt.verify(actualToken, secretKey)
				console.log("decoded token", decoded)
				user = decoded
			} catch(err) {
				console.log("eeeeeeee",err)
			}
		}

		return {
			user: user,
			prisma: prisma
		}
	},

  schema: createSchema({
    typeDefs: /* GraphQL */ `
      
      type User {
        id: String!
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
		},
		user: (root, args, ctx: Context) => {
			return ctx.prisma.user.findFirst({
				where: {
					id: args.userId
				}
			})
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
            id: database.users.length + 1,
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


