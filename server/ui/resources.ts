import { getResources, onResourcesChange, type Resources } from "./state"
import { withLayout } from "./nav"

const fmt = (n: number) => Math.floor(n).toLocaleString()

const ResourceRow = (label: string, value: number, img?: string) => {
	const row = document.createElement("div")
	row.style.display = "grid"
	row.style.gridTemplateColumns = "32px 1fr auto"
	row.style.alignItems = "center"
	row.style.gap = "10px"
	row.style.padding = "10px"
	row.style.border = "1px solid var(--border)"
	row.style.borderRadius = "8px"
	row.style.background = "var(--card)"

	const icon = document.createElement("div")
	if (img) {
		const i = document.createElement("img")
		i.src = img
		i.alt = label
		i.style.width = "28px"
		i.style.height = "28px"
		i.style.objectFit = "contain"
		icon.appendChild(i)
	} else {
		icon.textContent = label[0]
		icon.style.textAlign = "center"
		icon.style.color = "#bbb"
	}
	row.appendChild(icon)

	const name = document.createElement("div")
	name.textContent = label
	name.style.color = "var(--fg)"
	name.style.fontSize = "14px"
	row.appendChild(name)

	const val = document.createElement("div")
	val.textContent = fmt(value)
	val.style.color = "var(--muted)"
	val.style.fontVariantNumeric = "tabular-nums"
	row.appendChild(val)

	return { row, set: (v: number) => (val.textContent = fmt(v)) }
}

export const resourcesPage = (body: HTMLElement) => {
	withLayout(body, "resources", (root) => {
		const list = document.createElement("div")
		list.style.display = "grid"
		list.style.gap = "10px"

		const wood = ResourceRow("Wood", 0, "/assets/woodcut.png")
		const iron = ResourceRow("Iron", 0, "/assets/ironmine.png")
		const food = ResourceRow("Food", 0, "/assets/farm_1.png")
		list.appendChild(wood.row)
		list.appendChild(iron.row)
		list.appendChild(food.row)

		root.appendChild(list)

		const update = (r: Resources) => {
			wood.set(r.wood)
			iron.set(r.iron)
			food.set(r.food)
		}
		update(getResources())
		const unsubscribe = onResourcesChange(update)
		window.addEventListener("popstate", () => unsubscribe(), { once: true })
	})
}
