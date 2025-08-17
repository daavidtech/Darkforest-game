import { withLayout } from "./nav"
import {
	getPlacedAt,
	onBuildingsChange,
	onBuildQueueChange,
	requestUpgradeAt,
	getBuildQueue,
} from "./state"
import { navigate } from "./router"

const fmtTimeLeft = (ms: number) => {
	if (ms <= 0) return "Done"
	const s = Math.ceil(ms / 1000)
	return `${s}s`
}

export const buildingPage = (body: HTMLElement, x: number, y: number) => {
	withLayout(body, "overview", (root) => {
		const header = document.createElement("div")
		header.style.display = "flex"
		header.style.justifyContent = "space-between"
		header.style.alignItems = "center"
		const title = document.createElement("h2")
		title.textContent = `Building @ (${x},${y})`
		title.style.margin = "0 0 12px"
		const back = document.createElement("button")
		back.textContent = "Back to Map"
		back.style.padding = "6px 10px"
		back.style.border = "1px solid var(--border)"
		back.style.background = "var(--button-bg)"
		back.style.color = "var(--fg)"
		back.style.borderRadius = "6px"
		back.style.cursor = "pointer"
		back.onclick = () => navigate("/map")
		header.appendChild(title)
		header.appendChild(back)

		const card = document.createElement("div")
		card.style.border = "1px solid var(--border)"
		card.style.borderRadius = "10px"
		card.style.background = "var(--card)"
		card.style.padding = "12px"
		card.style.display = "grid"
		card.style.gap = "8px"

		const nameRow = document.createElement("div")
		const levelRow = document.createElement("div")
		const statusRow = document.createElement("div")
		const progress = document.createElement("div")
		progress.style.height = "8px"
		progress.style.borderRadius = "999px"
		progress.style.background = "var(--track)"
		progress.style.overflow = "hidden"
		const bar = document.createElement("div")
		bar.style.height = "100%"
		bar.style.width = "0%"
		bar.style.background = "var(--accent)"
		progress.appendChild(bar)

		const upgrade = document.createElement("button")
		upgrade.textContent = "Upgrade"
		upgrade.style.padding = "8px 12px"
		upgrade.style.border = "1px solid var(--border)"
		upgrade.style.background = "var(--button-bg)"
		upgrade.style.color = "var(--fg)"
		upgrade.style.borderRadius = "6px"
		upgrade.style.cursor = "pointer"

		const render = () => {
			const pb = getPlacedAt(x, y)
			if (!pb) {
				nameRow.textContent = "No building here."
				levelRow.textContent = ""
				statusRow.textContent = ""
				upgrade.disabled = true
				bar.style.width = "0%"
				return
			}
			nameRow.textContent = `Name: ${pb.building.name}`
			levelRow.textContent = `Level: ${pb.level}`
			const q = getBuildQueue().find(
				(i) =>
					i.origin.x === x &&
					i.origin.y === y &&
					i.status === "building",
			)
			if (q) {
				const total = q.finishAt - q.startedAt
				const elapsed = Math.min(
					total,
					Math.max(0, Date.now() - q.startedAt),
				)
				const pct = total > 0 ? Math.round((elapsed / total) * 100) : 0
				bar.style.width = `${pct}%`
				statusRow.textContent = `In progress (${fmtTimeLeft(q.finishAt - Date.now())})`
				upgrade.disabled = true
			} else {
				bar.style.width = "0%"
				statusRow.textContent = "Idle"
				upgrade.disabled = false
			}
		}

		upgrade.onclick = () => {
			requestUpgradeAt(x, y)
			render()
		}

		card.appendChild(nameRow)
		card.appendChild(levelRow)
		card.appendChild(statusRow)
		card.appendChild(progress)
		card.appendChild(upgrade)

		root.appendChild(header)
		root.appendChild(card)

		const unq = onBuildQueueChange(() => render())
		const unb = onBuildingsChange(() => render())
		render()

		window.addEventListener(
			"popstate",
			() => {
				unq()
				unb()
			},
			{ once: true },
		)
	})
}
