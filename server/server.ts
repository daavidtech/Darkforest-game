import index from "./ui/index.html"
import { createJWT, verifyJWT } from "./jwt"
import { initDB, getUser as dbGetUser, getUserRates, db } from "./db"

db.init()

// Demo users with per-user resource rates
type Rates = { wood: number; iron: number; food: number }
const users: Record<string, { password: string; rates: Rates }> = {
	admin: { password: "password", rates: { wood: 1, iron: 1, food: 1 } },
	alice: { password: "alicepass", rates: { wood: 2, iron: 0.6, food: 1.2 } },
	bob: { password: "bobpass", rates: { wood: 0.7, iron: 2.2, food: 1.5 } },
}

type JWTPayload = Record<string, any>

const json = (data: any, init: ResponseInit = {}) =>
	new Response(JSON.stringify(data), {
		headers: { "content-type": "application/json" },
		...init,
	})

type Handler = (req: Request) => Response | Promise<Response>
const methodRoutes = (
	handlers: Partial<
		Record<"GET" | "POST" | "PUT" | "PATCH" | "DELETE", Handler>
	>,
): Handler => {
	return (req: Request) => {
		const fn = handlers[req.method as keyof typeof handlers]
		if (!fn) return new Response("Method Not Allowed", { status: 405 })
		return fn(req)
	}
}

const withAuth = (
	handler: (req: Request, user: JWTPayload) => Response | Promise<Response>,
) => {
	return async (req: Request) => {
		const auth = req.headers.get("authorization") || ""
		const m = auth.match(/^Bearer\s+(.+)$/i)
		if (!m) return new Response("Unauthorized", { status: 401 })
		const payload = await verifyJWT(m[1])
		if (!payload) return new Response("Unauthorized", { status: 401 })
		return handler(req, payload)
	}
}

Bun.serve({
	port: 4200,
	routes: {
		"/assets/*": (req) => {
			const url = new URL(req.url)
			const path = url.pathname.replace("/assets", "")
			const file = Bun.file(`./server/assets${path}`)
			return new Response(file)
		},
		"/api/login": methodRoutes({
			POST: async (req) => {
				const { username, password } = await req.json()
				// Ensure DB is initialized
				initDB()
				const u = dbGetUser(username)
				if (u && u.password === password) {
					const token = await createJWT({ sub: username })
					return json({ token })
				}
				return json({ error: "Invalid credentials" }, { status: 401 })
			},
		}),
		"/api/me": methodRoutes({
			GET: withAuth(async (_req, payload) =>
				json({ user: { username: payload.sub } }),
			),
		}),
		"/api/rates": methodRoutes({
			GET: withAuth(async (_req, payload) => {
				initDB()
				const rates = getUserRates(payload.sub as string)
				if (!rates)
					return json({ rates: { wood: 1, iron: 1, food: 1 } })
				return json({ rates })
			}),
		}),
		"/*": index,
	},
	error(err) {
		console.error(err)
		const msg = err instanceof Error ? err.message : String(err)
		return json({ success: false, message: msg }, { status: 500 })
	},
})
