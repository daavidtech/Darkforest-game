import index from "./ui/index.html"
import { createJWT, verifyJWT } from "./jwt"
import { db } from "./db"

db.init()

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
				const u = db.getUserByUsername(username)
				if (u && u.password === password) {
					const token = await createJWT({ sub: u.id })
					return json({ token })
				}
				return json({ error: "Invalid credentials" }, { status: 401 })
			},
		}),
		"/api/me": methodRoutes({
			GET: withAuth(async (_req, payload) => {
				const u = db.getUserById(payload.sub as string)
				if (!u) return json({ user: null }, { status: 404 })
				return json({ user: { id: u.id, username: u.username } })
			}),
		}),
		"/api/rates": methodRoutes({
			GET: withAuth(async (_req, payload) => {
				const rates = db.getUserRates(payload.sub as string)
				if (!rates)
					return json({ rates: { wood: 1, iron: 1, food: 1 } })
				return json({ rates })
			}),
		}),
		"/api/buildings": methodRoutes({
			GET: withAuth((_req, payload) => {
				const buildings = db.getUserBuildings(payload.sub as string)
				return json({ buildings })
			}),
			POST: withAuth(async (req, payload) => {
				const b = (await req.json()) as any
				db.upsertUserBuilding(payload.sub as string, b)
				return json({ success: true })
			}),
		}),
		"/api/units": methodRoutes({
			GET: withAuth((_req, payload) => {
				const units = db.getUserUnits(payload.sub as string)
				return json({ units })
			}),
			POST: withAuth(async (req, payload) => {
				const u = (await req.json()) as any
				db.upsertUserUnit(payload.sub as string, u)
				return json({ success: true })
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
