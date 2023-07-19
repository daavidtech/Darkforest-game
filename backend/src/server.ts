import { PrismaClient } from '@prisma/client';
import { error } from 'console'
import { createSchema, createYoga } from 'graphql-yoga'
import { createServer } from 'http'
import { hash, compare } from "bcrypt"

const jwt = require('jsonwebtoken');

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';





const secretKey = 'yourSecretKey';

const database: any = {
	users: [{

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



		if (actualToken) {
			try {
				const decoded = jwt.verify(actualToken, secretKey)
				console.log("decoded token", decoded)
				user = decoded
			} catch (err) {
				console.log("eeeeeeee", err)
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

		type RegisterResponse {
			viewer: Viewer!
		}
		
		type Query {
			email: String!
			username: String!
			viewer: Viewer! 
			user: User!
		}
		
		type Mutation {
			register(email: String!, username: String!, password: String!): RegisterResponse
			login(username: String!, password: String!): LoginResponse!
		}
	 	`,
		resolvers: {
			Viewer: {
				user: (root, args, ctx: Context) => {
					return ctx.user
				}
			},
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
				login: async (root, args, ctx: Context) => {

					console.log(args)


					const user = await ctx.prisma.user.findFirst({
						where: {
							username: args.username,

						}
					})

					if (!user) {
						throw new Error('No such user found')
					}

					console.log("salasana", user.passwordHash)
					console.log("syötetty ", args.password)


					if (await compare(args.password, user.passwordHash) === false {
						throw new Error('Invalid password')
					};

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
				register: async (root, args, ctx: Context) => {
					const existingUser = await ctx.prisma.user.findFirst({
						where: {
							OR: [
								{ username: args.username },
								{ email: args.email },
							],
						},
					});

					if (existingUser) {
						throw new Error("User already found from database")
					}

					const passwordHash = await hash(args.password, saltRounds)

					const newUser = await ctx.prisma.user.create({
						data: {
							username: args.username,
							email: args.email,
							passwordHash: passwordHash,
						},
					});

					console.log('New user created:', newUser);

					return {
						viewer: {}
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


