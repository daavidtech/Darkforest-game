import { mapPage } from "./map"
import { overviewPage } from "./overview"
import { navigate, routes } from "./router"
import { loginPage } from "./login"
import { resourcesPage } from "./resources"
import { applyThemeFromStorage } from "./theme"
import { refreshUser, getUser } from "./auth"
import { loadResourceRates } from "./state"

window.onload = () => {
	applyThemeFromStorage()
	refreshUser()
		.then(() => loadResourceRates())
		.catch(() => {})
	const body = document.querySelector("body")
	if (!body) {
		console.error("Body element not found")
		return
	}

	const requireAuth = (handler: () => void) => () => {
		const user = getUser()
		if (!user) {
			navigate("/login")
			return
		}
		handler()
	}

	routes({
		"/": () => {
			const user = getUser()
			if (!user) return navigate("/login")
			overviewPage(body)
		},
		"/map": requireAuth(() => mapPage(body)),
		"/login": () => loginPage(body),
		"/resources": requireAuth(() => resourcesPage(body)),
		"/*": () => {
			body.innerHTML = "<h1>404 Not Found</h1>"
		},
	})
}
