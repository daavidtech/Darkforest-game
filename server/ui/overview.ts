import { navigate } from "./router"
import { getBuildQueue, onBuildQueueChange, type BuildQueueItem, getResources, onResourcesChange, type Resources } from "./state"
import { withLayout } from "./nav"

const fmtTimeLeft = (ms: number) => {
    if (ms <= 0) return "Done"
    const s = Math.ceil(ms / 1000)
    return `${s}s`
}

const renderQueueList = (container: HTMLElement, items: BuildQueueItem[]) => {
    container.innerHTML = ""
    if (!items.length) {
        const empty = document.createElement("div")
        empty.textContent = "No buildings in queue."
        empty.style.color = "#bbb"
        empty.style.fontSize = "13px"
        empty.style.textAlign = "center"
        empty.style.padding = "12px 0"
        container.appendChild(empty)
        return
    }

    const now = Date.now()
    items
        .slice()
        .sort((a, b) => a.finishAt - b.finishAt)
        .forEach((item) => {
            const row = document.createElement("div")
            row.style.display = "grid"
            row.style.gridTemplateColumns = "36px 1fr auto"
            row.style.gap = "10px"
            row.style.alignItems = "center"
            row.style.padding = "8px"
            row.style.border = "1px solid var(--border)"
            row.style.borderRadius = "8px"
            row.style.background = "var(--card)"

            const img = document.createElement("img")
            img.src = item.building.img
            img.alt = item.building.name
            img.style.width = "36px"
            img.style.height = "36px"
            img.style.objectFit = "contain"
            row.appendChild(img)

            const middle = document.createElement("div")
            middle.style.display = "flex"
            middle.style.flexDirection = "column"
            middle.style.gap = "6px"
            const title = document.createElement("div")
            title.textContent = `${item.building.name} @ (${item.origin.x},${item.origin.y})`
            title.style.fontSize = "14px"
            title.style.color = "var(--fg)"
            middle.appendChild(title)

            const total = item.finishAt - item.startedAt
            const elapsed = Math.min(total, Math.max(0, now - item.startedAt))
            const pct = total > 0 ? Math.round((elapsed / total) * 100) : 100

            const barWrap = document.createElement("div")
            barWrap.style.height = "8px"
            barWrap.style.borderRadius = "999px"
            barWrap.style.background = "var(--track)"
            barWrap.style.overflow = "hidden"

            const bar = document.createElement("div")
            bar.style.width = `${pct}%`
            bar.style.height = "100%"
            bar.style.background = item.status === "completed" ? "var(--accent)" : "var(--accent-strong)"
            barWrap.appendChild(bar)
            middle.appendChild(barWrap)
            row.appendChild(middle)

            const right = document.createElement("div")
            right.style.fontSize = "12px"
            right.style.color = item.status === "completed" ? "var(--fg)" : "var(--muted)"
            right.textContent = item.status === "completed" ? "Completed" : fmtTimeLeft(item.finishAt - now)
            row.appendChild(right)

            container.appendChild(row)
        })
}

export const overviewPage = (body: HTMLElement) => {
    withLayout(body, "overview", (root) => {
        const grid = document.createElement("div")
        grid.style.display = "grid"
        grid.style.gridTemplateColumns = "1fr"
        grid.style.gap = "16px"

        // Card: Build Queue
        const queueCard = document.createElement("div")
        queueCard.style.border = "1px solid var(--border)"
        queueCard.style.borderRadius = "10px"
        queueCard.style.background = "var(--card)"
        queueCard.style.overflow = "hidden"
        const qh = document.createElement("div")
        qh.textContent = "Build Queue"
        qh.style.padding = "12px 14px"
        qh.style.fontWeight = "600"
        qh.style.borderBottom = "1px solid var(--border)"
        const qbody = document.createElement("div")
        qbody.style.display = "grid"
        qbody.style.gap = "8px"
        qbody.style.padding = "12px"
        queueCard.appendChild(qh)
        queueCard.appendChild(qbody)

        // Resources card (summary)
        const resCard = document.createElement("div")
        resCard.style.border = "1px solid var(--border)"
        resCard.style.borderRadius = "10px"
        resCard.style.background = "var(--card)"
        const rh = document.createElement("div")
        rh.textContent = "Resources"
        rh.style.padding = "12px 14px"
        rh.style.fontWeight = "600"
        rh.style.borderBottom = "1px solid var(--border)"
        const rbody = document.createElement("div")
        rbody.style.padding = "12px 14px"
        rbody.style.color = "var(--muted)"
        rbody.style.fontSize = "13px"
        rbody.style.display = "grid"
        rbody.style.gap = "8px"

        const makeRow = (label: string) => {
            const row = document.createElement("div")
            row.style.display = "flex"
            row.style.justifyContent = "space-between"
            row.style.alignItems = "center"
            const l = document.createElement("span")
            l.textContent = label
            l.style.color = "var(--muted)"
            const v = document.createElement("span")
            v.style.color = "var(--fg)"
            v.style.fontVariantNumeric = "tabular-nums"
            row.appendChild(l)
            row.appendChild(v)
            return { row, set: (n: number) => (v.textContent = Math.floor(n).toLocaleString()) }
        }
        const wood = makeRow("Wood")
        const iron = makeRow("Iron")
        const food = makeRow("Food")
        rbody.appendChild(wood.row)
        rbody.appendChild(iron.row)
        rbody.appendChild(food.row)

        const resourcesFooter = document.createElement("div")
        resourcesFooter.style.display = "flex"
        resourcesFooter.style.justifyContent = "flex-end"
        resourcesFooter.style.marginTop = "6px"
        const openResources = document.createElement("button")
        openResources.textContent = "Open Resources"
        openResources.style.padding = "6px 10px"
        openResources.style.border = "1px solid var(--border)"
        openResources.style.background = "var(--button-bg)"
        openResources.style.color = "var(--fg)"
        openResources.style.borderRadius = "6px"
        openResources.style.cursor = "pointer"
        openResources.onclick = () => navigate("/resources")
        resourcesFooter.appendChild(openResources)
        resCard.appendChild(rh)
        resCard.appendChild(rbody)
        resCard.appendChild(resourcesFooter)

        grid.appendChild(queueCard)
        grid.appendChild(resCard)
        root.appendChild(grid)

        // Initial render and updates
        renderQueueList(qbody, getBuildQueue())
        const unsubscribe = onBuildQueueChange((items) => renderQueueList(qbody, items))

        // Live progress updater
        const interval = setInterval(() => renderQueueList(qbody, getBuildQueue()), 250)

        const applyResources = (r: Resources) => {
            wood.set(r.wood)
            iron.set(r.iron)
            food.set(r.food)
        }
        applyResources(getResources())
        const unres = onResourcesChange(applyResources)

        // Clean up when navigating away
        window.addEventListener(
            "popstate",
            () => {
                clearInterval(interval)
                unsubscribe()
                unres()
            },
            { once: true },
        )
    })
}
