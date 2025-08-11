import { mapPage } from "./map"
import { overviewPage } from "./overview"
import { routes } from "./router"

window.onload = () => {
    const body = document.querySelector("body")
    if (!body) {
        console.error("Body element not found")
        return
    }

    routes({
        "/": () => overviewPage(body),
        "/map": () => mapPage(body),
        "/*": () => {
            body.innerHTML = "<h1>404 Not Found</h1>"
        }
    })
}