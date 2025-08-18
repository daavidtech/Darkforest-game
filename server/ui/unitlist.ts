import { withLayout } from "./nav"
import {
	getTrainQueue,
	onTrainQueueChange,
	type TrainQueueItem,
	getUnits,
	onUnitsChange,
	type Unit,
} from "./state"

const fmtTimeLeft = (ms: number) => {
	if (ms <= 0) return "Done"
	const s = Math.ceil(ms / 1000)
	return `${s}s`
}

const renderQueueList = (container: HTMLElement, items: TrainQueueItem[]) => {
	container.innerHTML = ""
	if (!items.length) {
		const empty = document.createElement("div")
		empty.textContent = "No units training."
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
			row.style.gridTemplateColumns = "1fr auto"
			row.style.gap = "10px"
			row.style.alignItems = "center"
			row.style.padding = "8px"
			row.style.border = "1px solid var(--border)"
			row.style.borderRadius = "8px"
			row.style.background = "var(--card)"
			const title = document.createElement("div")
			title.textContent = `${item.unit} @ (${item.origin.x},${item.origin.y})`
			title.style.fontSize = "14px"
			const total = item.finishAt - item.startedAt
			const elapsed = Math.min(total, Math.max(0, now - item.startedAt))
			const status = document.createElement("div")
			status.style.fontSize = "12px"
			status.style.color =
				item.status === "completed" ? "var(--fg)" : "var(--muted)"
			status.textContent =
				item.status === "completed"
					? "Completed"
					: fmtTimeLeft(item.finishAt - now)
			row.appendChild(title)
			row.appendChild(status)
			container.appendChild(row)
		})
}

const renderUnits = (container: HTMLElement, units: Unit[]) => {
	container.innerHTML = ""
	if (!units.length) {
		const empty = document.createElement("div")
		empty.textContent = "No units available."
		empty.style.color = "#bbb"
		empty.style.fontSize = "13px"
		empty.style.textAlign = "center"
		empty.style.padding = "12px 0"
		container.appendChild(empty)
		return
	}
	units.forEach((u) => {
		const row = document.createElement("div")
		row.textContent = `${u.type} @ (${u.origin.x},${u.origin.y})`
		row.style.padding = "4px 0"
		container.appendChild(row)
	})
}

export const unitListPage = (body: HTMLElement) => {
	withLayout(body, "units", (root) => {
		const grid = document.createElement("div")
		grid.style.display = "grid"
		grid.style.gridTemplateColumns = "1fr"
		grid.style.gap = "16px"
		const queueCard = document.createElement("div")
		queueCard.style.border = "1px solid var(--border)"
		queueCard.style.borderRadius = "10px"
		queueCard.style.background = "var(--card)"
		const qh = document.createElement("div")
		qh.textContent = "Training Queue"
		qh.style.padding = "12px 14px"
		qh.style.fontWeight = "600"
		qh.style.borderBottom = "1px solid var(--border)"
		const qbody = document.createElement("div")
		qbody.style.display = "grid"
		qbody.style.gap = "8px"
		qbody.style.padding = "12px"
		queueCard.appendChild(qh)
		queueCard.appendChild(qbody)
		const unitCard = document.createElement("div")
		unitCard.style.border = "1px solid var(--border)"
		unitCard.style.borderRadius = "10px"
		unitCard.style.background = "var(--card)"
		const uh = document.createElement("div")
		uh.textContent = "Units"
		uh.style.padding = "12px 14px"
		uh.style.fontWeight = "600"
		uh.style.borderBottom = "1px solid var(--border)"
		const ubody = document.createElement("div")
		ubody.style.padding = "12px"
		ubody.style.display = "grid"
		ubody.style.gap = "4px"
		unitCard.appendChild(uh)
		unitCard.appendChild(ubody)
		grid.appendChild(queueCard)
		grid.appendChild(unitCard)
		root.appendChild(grid)
		renderQueueList(qbody, getTrainQueue())
		renderUnits(ubody, getUnits())
		const unq = onTrainQueueChange((items) => renderQueueList(qbody, items))
		const unu = onUnitsChange((items) => renderUnits(ubody, items))
		const interval = setInterval(
			() => renderQueueList(qbody, getTrainQueue()),
			250,
		)
		window.addEventListener(
			"popstate",
			() => {
				unq()
				unu()
				clearInterval(interval)
			},
			{ once: true },
		)
	})
}
