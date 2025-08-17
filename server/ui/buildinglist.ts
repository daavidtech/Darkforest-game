export type Building = {
	name: string
	img: string
	shape: { x: number; y: number }[]
}

const buildings: Building[] = [
	// Keep one classic rectangle
	{
		name: "Barrack",
		img: "/assets/barrack_1.png",
		shape: [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
		],
	},
	// 3x1 bar
	{
		name: "Farm",
		img: "/assets/farm_1.png",
		shape: [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
		],
	},
	// L-shape (2x2 missing one corner)
	{
		name: "School",
		img: "/assets/school.png",
		shape: [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 0, y: 1 },
		],
	},
	// T-shape width 3, height 2
	{
		name: "Storage Pit",
		img: "/assets/storagepit.png",
		shape: [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 1, y: 1 },
		],
	},
	// Plus shape
	{
		name: "Woodcut Camp",
		img: "/assets/woodcut.png",
		shape: [
			{ x: 1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 },
			{ x: 1, y: 2 },
		],
	},
	// 2x3 rectangle for variety
	{
		name: "Iron Mine",
		img: "/assets/ironmine.png",
		shape: [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 0, y: 2 },
			{ x: 1, y: 2 },
		],
	},
]

export const allBuildings = buildings

export const buildinglist = () => {
	const list = document.createElement("div")
	list.style.minWidth = "220px"
	list.style.padding = "12px"
	list.style.borderRight = "1px solid var(--border)"

	const title = document.createElement("h1")
	title.textContent = "Building List"
	title.style.fontSize = "18px"
	title.style.margin = "8px 0 12px"
	list.appendChild(title)

	const container = document.createElement("div")
	container.style.display = "grid"
	container.style.gridTemplateColumns = "repeat(2, 1fr)"
	container.style.gap = "8px"
	list.appendChild(container)

	const mime = "application/x-darkforest-building"

	buildings.forEach((building) => {
		const item = document.createElement("div")
		item.style.display = "flex"
		item.style.flexDirection = "column"
		item.style.alignItems = "center"
		item.style.justifyContent = "center"
		item.style.padding = "8px"
		item.style.border = "1px solid var(--border)"
		item.style.borderRadius = "8px"
		item.style.background = "var(--card)"
		item.style.cursor = "grab"
		item.style.userSelect = "none"
		item.draggable = true

		const img = document.createElement("img")
		img.src = building.img
		img.alt = building.name
		img.style.width = "80px"
		img.style.height = "80px"
		img.style.objectFit = "contain"

		const label = document.createElement("div")
		label.textContent = building.name
		label.style.fontSize = "12px"
		label.style.marginTop = "6px"

		item.appendChild(img)
		item.appendChild(label)

		item.addEventListener("dragstart", (e) => {
			const json = JSON.stringify(building)
			e.dataTransfer?.setData(mime, json)
			e.dataTransfer?.setData("text/plain", json)
			if (e.dataTransfer) {
				e.dataTransfer.effectAllowed = "copy"
			}
			;(window as any).__df_drag_building = building
			// small drag image helper
			const dragImg = img.cloneNode(true) as HTMLImageElement
			dragImg.style.width = "60px"
			dragImg.style.height = "60px"
			document.body.appendChild(dragImg)
			// position off-screen so it doesn't flash
			dragImg.style.position = "absolute"
			dragImg.style.left = "-9999px"
			e.dataTransfer?.setDragImage(dragImg, 30, 30)
			// remove after a tick
			setTimeout(() => dragImg.remove(), 0)
		})

		item.addEventListener("dragend", () => {
			if ((window as any).__df_drag_building) {
				delete (window as any).__df_drag_building
			}
		})

		container.appendChild(item)
	})

	return list
}
