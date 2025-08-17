import { patternMatcher } from "./pattern-matcher"

let matcher: any
const handleRoute = (path: string) => {
	if (!matcher) return
	const m = matcher.match(path)
	if (!m) console.error("No route found for", path)
	console.log("match result", m)
}
window.addEventListener("popstate", () => {
	handleRoute(window.location.pathname)
})

export const routes = (routes: any) => {
	matcher = patternMatcher(routes)
	handleRoute(window.location.pathname)
}

export const navigate = (path: string) => {
	window.history.pushState({}, "", path)
	handleRoute(path)
}
