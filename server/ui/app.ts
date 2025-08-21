import { mapPage } from "./map"
import { overviewPage } from "./overview"
import { navigate, routes } from "./router"
import { loginPage } from "./login"
import { resourcesPage } from "./resources"
import { applyThemeFromStorage } from "./theme"
import { refreshUser, getUser } from "./auth"
import { loadResourceRates, loadBuildings, loadUnits } from "./state"
import { buildingPage } from "./building"
import { unitListPage } from "./unitlist"

window.onload = () => {
	applyThemeFromStorage()
	refreshUser()
		.then(() => {
			loadResourceRates()
			loadBuildings()
			loadUnits()
		})
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
		"/units": requireAuth(() => unitListPage(body)),
		"/building/:x/:y": (params: any) => {
			const user = getUser()
			if (!user) return navigate("/login")
			const x = parseInt(params.x, 10)
			const y = parseInt(params.y, 10)
			buildingPage(body, x, y)
		},
		"/*": () => {
			body.innerHTML = "<h1>404 Not Found</h1>"
		},
	})
}
