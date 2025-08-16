import { mapPage } from "./map"
import { overviewPage } from "./overview"
import { routes } from "./router"
import { loginPage } from "./login"
import { resourcesPage } from "./resources"
import { applyThemeFromStorage } from "./theme"

window.onload = () => {
    applyThemeFromStorage()
    const body = document.querySelector("body")
    if (!body) {
        console.error("Body element not found")
        return
    }

    routes({
        "/": () => overviewPage(body),
        "/map": () => mapPage(body),
        "/login": () => loginPage(body),
        "/resources": () => resourcesPage(body),
        "/*": () => {
            body.innerHTML = "<h1>404 Not Found</h1>"
        }
    })
}
