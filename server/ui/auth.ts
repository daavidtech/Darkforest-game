const TOKEN_KEY = "df_token"
const USER_KEY = "df_user"

export type User = { id: string; username: string }

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export const getUser = (): User | null => {
	const raw = localStorage.getItem(USER_KEY)
	if (!raw) return null
	try {
		return JSON.parse(raw) as User
	} catch {
		return null
	}
}
export const setUser = (u: User | null) => {
	if (u) localStorage.setItem(USER_KEY, JSON.stringify(u))
	else localStorage.removeItem(USER_KEY)
}

export const fetchWithAuth = async (
	input: RequestInfo | URL,
	init: RequestInit = {},
) => {
	const token = getToken()
	const headers = new Headers(init.headers)
	if (token) headers.set("Authorization", `Bearer ${token}`)
	return fetch(input, { ...init, headers })
}

export const refreshUser = async () => {
	const token = getToken()
	if (!token) {
		setUser(null)
		return null
	}
	const res = await fetchWithAuth("/api/me")
	if (!res.ok) {
		setUser(null)
		return null
	}
	const data = await res.json()
	const user: User = data.user
	setUser(user)
	return user
}
