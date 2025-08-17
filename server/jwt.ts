const JWT_SECRET = Bun.env.JWT_SECRET ?? "dev-secret-change-me"

const te = new TextEncoder()

const b64url = (base64: string) =>
	base64.replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_")

const b64urlEncodeJSON = (obj: any) =>
	b64url(Buffer.from(JSON.stringify(obj)).toString("base64"))

async function signHS256(data: string) {
	const key = await crypto.subtle.importKey(
		"raw",
		te.encode(JWT_SECRET),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	)
	const sig = await crypto.subtle.sign("HMAC", key, te.encode(data))
	return b64url(Buffer.from(new Uint8Array(sig)).toString("base64"))
}

export async function createJWT(
	payload: Record<string, any>,
	expSeconds = 60 * 60,
) {
	const header = { alg: "HS256", typ: "JWT" }
	const now = Math.floor(Date.now() / 1000)
	const body = { iat: now, exp: now + expSeconds, ...payload }
	const h = b64urlEncodeJSON(header)
	const p = b64urlEncodeJSON(body)
	const unsigned = `${h}.${p}`
	const s = await signHS256(unsigned)
	return `${unsigned}.${s}`
}

export async function verifyJWT(
	token: string,
): Promise<Record<string, any> | null> {
	const parts = token.split(".")
	if (parts.length !== 3) return null
	const [h, p, s] = parts
	const unsigned = `${h}.${p}`
	const expected = await signHS256(unsigned)
	if (expected !== s) return null
	try {
		const json = JSON.parse(Buffer.from(p, "base64").toString())
		if (
			typeof json.exp === "number" &&
			Math.floor(Date.now() / 1000) > json.exp
		)
			return null
		return json
	} catch {
		return null
	}
}
