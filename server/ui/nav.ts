import { navigate } from "./router"
import { ThemeSwitch } from "./theme"
import { getUser, clearToken, setUser } from "./auth"

export type RouteKey = "overview" | "map" | "resources" | "units" | "login"

const NavLink = (label: string, path: string, active: boolean) => {
	const a = document.createElement("button")
	a.textContent = label
	a.style.padding = "8px 12px"
	a.style.border = "1px solid var(--border)"
	a.style.background = active ? "var(--accent)" : "var(--button-bg)"
	a.style.color = active ? "#111" : "var(--fg)"
	a.style.borderRadius = "6px"
	a.style.cursor = "pointer"
	a.onclick = () => navigate(path)
	return a
}

export const NavBar = (active: RouteKey) => {
	const header = document.createElement("div")
	header.style.position = "sticky"
	header.style.top = "0"
	header.style.zIndex = "10"
	header.style.background = "var(--bg)"
	header.style.borderBottom = "1px solid var(--border)"

	const wrap = document.createElement("div")
	wrap.style.maxWidth = "980px"
	wrap.style.margin = "0 auto"
	wrap.style.padding = "12px 16px"
	wrap.style.display = "flex"
	wrap.style.alignItems = "center"
	wrap.style.justifyContent = "space-between"

	const left = document.createElement("div")
	left.style.display = "flex"
	left.style.alignItems = "center"
	left.style.gap = "10px"
	const brand = document.createElement("div")
	brand.textContent = "Dark Forest"
	brand.style.fontWeight = "700"
	brand.style.letterSpacing = "0.3px"
	left.appendChild(brand)

	const center = document.createElement("div")
	center.style.display = "flex"
	center.style.gap = "8px"
	const current = getUser()
	if (current) {
		center.appendChild(NavLink("Overview", "/", active === "overview"))
		center.appendChild(NavLink("Map", "/map", active === "map"))
		center.appendChild(NavLink("Units", "/units", active === "units"))
		center.appendChild(
			NavLink("Resources", "/resources", active === "resources"),
		)
	}

	const right = document.createElement("div")
	right.style.display = "flex"
	right.style.gap = "8px"
	right.appendChild(ThemeSwitch())

	const user = getUser()
	if (user) {
		const name = document.createElement("span")
		name.textContent = user.username
		name.style.color = "var(--muted)"
		name.style.alignSelf = "center"
		const logout = document.createElement("button")
		logout.textContent = "Logout"
		logout.style.padding = "6px 10px"
		logout.style.border = "1px solid var(--border)"
		logout.style.background = "var(--button-bg)"
		logout.style.color = "var(--fg)"
		logout.style.borderRadius = "6px"
		logout.style.cursor = "pointer"
		logout.onclick = () => {
			clearToken()
			setUser(null)
			navigate("/login")
		}
		right.appendChild(name)
		right.appendChild(logout)
	}

	wrap.appendChild(left)
	wrap.appendChild(center)
	wrap.appendChild(right)
	header.appendChild(wrap)
	return header
}

// Helper to mount a page with the shared nav and container
export const withLayout = (
	body: HTMLElement,
	active: RouteKey,
	render: (content: HTMLElement) => void,
) => {
	body.style.margin = "0"
	body.style.background = "var(--bg)"
	body.style.color = "var(--fg)"

	const container = document.createElement("div")
	container.style.maxWidth = "980px"
	container.style.margin = "0 auto"
	container.style.padding = "16px"

	const content = document.createElement("div")
	container.appendChild(content)

	body.innerHTML = ""
	body.appendChild(NavBar(active))
	body.appendChild(container)

	render(content)
}
