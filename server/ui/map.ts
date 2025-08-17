import type { Building } from "./buildinglist"
import { buildinglist, allBuildings } from "./buildinglist"
import { enqueueBuild, getBuildQueue, onBuildQueueChange } from "./state"
import { withLayout } from "./nav"

const GRID_W = 20
const GRID_H = 20
const CELL = 60
const mime = "application/x-darkforest-building"

type Cell = { el: HTMLDivElement; x: number; y: number }

const inBounds = (x: number, y: number) =>
	x >= 0 && y >= 0 && x < GRID_W && y < GRID_H

export type PlacedBuilding = {
	building: Building
	origin: { x: number; y: number }
	owner: "self" | "enemy"
}

const MapView = () => {
	const root = document.createElement("div")
	root.style.position = "relative"
	root.style.display = "flex"
	root.style.flexDirection = "column"
	root.style.flex = "1"
	root.style.gap = "0px"
	root.style.minHeight = "60vh"

	// state
	const grid: Cell[][] = []
	const occupied = new Set<string>() // key `${x},${y}`
	const placed: PlacedBuilding[] = []

	const viewport = document.createElement("div")
	viewport.style.position = "relative"
	viewport.style.flex = "1"
	viewport.style.overflow = "hidden"
	viewport.style.border = "1px solid var(--border)"
	viewport.style.background = "var(--tile)"
	viewport.style.touchAction = "none" // enable custom panning/zoom on touch
	viewport.style.height = "80vh"

	const gridEl = document.createElement("div")
	gridEl.style.display = "flex"
	gridEl.style.flexDirection = "column"
	gridEl.style.userSelect = "none"
	gridEl.style.transformOrigin = "0 0"

	const makeKey = (x: number, y: number) => `${x},${y}`

	const getDraggedBuilding = (dt: DataTransfer | null): Building | null => {
		if (!dt) return (window as any).__df_drag_building ?? null
		let data = ""
		if (dt.types.includes(mime)) {
			data = dt.getData(mime)
		} else if (dt.types.includes("text/plain")) {
			data = dt.getData("text/plain")
		}
		if (data) {
			try {
				return JSON.parse(data)
			} catch {
				return null
			}
		}
		return (window as any).__df_drag_building ?? null
	}

	const highlightCells = (cells: { x: number; y: number }[], ok: boolean) => {
		cells.forEach(({ x, y }) => {
			if (!inBounds(x, y)) return
			const c = grid[y][x].el
			c.style.outline = ok ? "3px solid #4caf50" : "3px solid #e53935"
			c.style.outlineOffset = "-3px"
		})
	}

	const clearHighlights = () => {
		for (let y = 0; y < GRID_H; y++) {
			for (let x = 0; x < GRID_W; x++) {
				const c = grid[y][x].el
				c.style.outline = ""
				c.style.outlineOffset = ""
			}
		}
	}

	const canPlace = (building: Building, ox: number, oy: number) => {
		for (const p of building.shape) {
			const x = ox + p.x
			const y = oy + p.y
			if (!inBounds(x, y)) return false
			if (occupied.has(makeKey(x, y))) return false
		}
		return true
	}

	const renderBuilding = (b: PlacedBuilding) => {
		const { building, origin } = b
		// compute bounding box of the shape so we can scale the sprite to fit
		let minX = Infinity,
			minY = Infinity,
			maxX = -Infinity,
			maxY = -Infinity
		for (const p of building.shape) {
			if (p.x < minX) minX = p.x
			if (p.y < minY) minY = p.y
			if (p.x > maxX) maxX = p.x
			if (p.y > maxY) maxY = p.y
		}
		const width = maxX - minX + 1
		const height = maxY - minY + 1
		const bgSize = `${CELL * width}px ${CELL * height}px`

		building.shape.forEach(({ x, y }) => {
			const cx = origin.x + x
			const cy = origin.y + y
			if (!inBounds(cx, cy)) return
			const cell = grid[cy][cx].el
			let tile = cell.querySelector<HTMLDivElement>("div.df-tile")
			if (!tile) {
				tile = document.createElement("div")
				tile.className = "df-tile"
				tile.style.position = "absolute"
				tile.style.left = "0"
				tile.style.top = "0"
				tile.style.right = "0"
				tile.style.bottom = "0"
				tile.style.zIndex = "1"
				cell.appendChild(tile)
			}
			tile.style.backgroundImage = `url(${building.img})`
			tile.style.backgroundSize = bgSize
			const lx = x - minX
			const ly = y - minY
			tile.style.backgroundPosition = `${-lx * CELL}px ${-ly * CELL}px`
			tile.style.backgroundRepeat = "no-repeat"
		})

		applyTint(b)
		applyOutline(b)
	}

	const isInProgress = (b: PlacedBuilding) => {
		const q = getBuildQueue()
		const item = q.find(
			(i) =>
				i.origin.x === b.origin.x &&
				i.origin.y === b.origin.y &&
				i.building.name === b.building.name,
		)
		return !!item && item.status === "building"
	}

	const applyTint = (b: PlacedBuilding) => {
		const tintFilter = isInProgress(b) ? "grayscale(0.6) opacity(0.8)" : ""
		b.building.shape.forEach(({ x, y }) => {
			const cx = b.origin.x + x
			const cy = b.origin.y + y
			if (!inBounds(cx, cy)) return
			const cell = grid[cy][cx].el
			const tile = cell.querySelector<HTMLDivElement>("div.df-tile")
			if (tile) tile.style.filter = tintFilter
		})
	}

	const applyOutline = (b: PlacedBuilding) => {
		const color = b.owner === "self" ? "#69f0ae" : "#ff5252"
		// Build a quick lookup for this building's shape cells in world coords
		const cellSet = new Set<string>()
		b.building.shape.forEach(({ x, y }) => {
			cellSet.add(`${b.origin.x + x},${b.origin.y + y}`)
		})

		const base =
			getComputedStyle(document.documentElement).getPropertyValue(
				"--border",
			) || "var(--border)"
		b.building.shape.forEach(({ x, y }) => {
			const cx = b.origin.x + x
			const cy = b.origin.y + y
			if (!inBounds(cx, cy)) return
			const cell = grid[cy][cx].el
			// Clear any previous outline style if set
			cell.style.outline = ""
			cell.style.outlineOffset = ""
			// Reset widths and styles
			cell.style.borderLeftWidth = "1px"
			cell.style.borderRightWidth = "1px"
			cell.style.borderTopWidth = "1px"
			cell.style.borderBottomWidth = "1px"
			cell.style.borderStyle = "solid"

			// Determine which edges are outer by checking neighboring tiles within the same building shape
			const keyL = `${cx - 1},${cy}`
			const keyR = `${cx + 1},${cy}`
			const keyT = `${cx},${cy - 1}`
			const keyB = `${cx},${cy + 1}`

			// Apply per-side border colors; keep width at 1px to avoid layout shift
			const leftOuter = !cellSet.has(keyL)
			const rightOuter = !cellSet.has(keyR)
			const topOuter = !cellSet.has(keyT)
			const bottomOuter = !cellSet.has(keyB)

			cell.style.borderLeftColor = leftOuter ? color : base
			cell.style.borderRightColor = rightOuter ? color : base
			cell.style.borderTopColor = topOuter ? color : base
			cell.style.borderBottomColor = bottomOuter ? color : base

			cell.style.borderLeftWidth = leftOuter ? "3px" : "1px"
			cell.style.borderRightWidth = rightOuter ? "3px" : "1px"
			cell.style.borderTopWidth = topOuter ? "3px" : "1px"
			cell.style.borderBottomWidth = bottomOuter ? "3px" : "1px"
		})
	}

	const place = (building: Building, ox: number, oy: number) => {
		building.shape.forEach(({ x, y }) =>
			occupied.add(makeKey(ox + x, oy + y)),
		)
		const pb: PlacedBuilding = {
			building,
			origin: { x: ox, y: oy },
			owner: "self",
		}
		placed.push(pb)
		renderBuilding(pb)
		// Add to global build queue for overview tracking
		enqueueBuild(building, { x: ox, y: oy })
	}

	// Optional: quick helper to place an enemy building via console
	const placeEnemy = (building: Building, ox: number, oy: number) => {
		if (!canPlace(building, ox, oy)) return false
		building.shape.forEach(({ x, y }) =>
			occupied.add(makeKey(ox + x, oy + y)),
		)
		const pb: PlacedBuilding = {
			building,
			origin: { x: ox, y: oy },
			owner: "enemy",
		}
		placed.push(pb)
		renderBuilding(pb)
		return true
	}

	const handleDragOverOrEnter = (e: DragEvent, cell: Cell) => {
		const building = getDraggedBuilding(e.dataTransfer)
		if (!building) return
		e.preventDefault()
		e.dataTransfer!.dropEffect = "copy"
		const previewCells = building.shape.map((p) => ({
			x: cell.x + p.x,
			y: cell.y + p.y,
		}))
		const ok = canPlace(building, cell.x, cell.y)
		clearHighlights()
		highlightCells(previewCells, ok)
	}

	const handleDrop = (e: DragEvent, cell: Cell) => {
		const building = getDraggedBuilding(e.dataTransfer)
		if (!building) return
		e.preventDefault()
		const ok = canPlace(building, cell.x, cell.y)
		clearHighlights()
		if (!ok) return
		place(building, cell.x, cell.y)
	}

	for (let y = 0; y < GRID_H; y++) {
		const row = document.createElement("div")
		row.style.display = "flex"
		row.style.flexDirection = "row"
		const rowArr: Cell[] = []
		for (let x = 0; x < GRID_W; x++) {
			const cell = document.createElement("div")
			cell.style.width = `${CELL}px`
			cell.style.height = `${CELL}px`
			cell.style.border = "1px solid var(--border)"
			cell.style.display = "inline-block"
			cell.style.boxSizing = "border-box"
			cell.style.backgroundColor = "var(--tile)"
			cell.style.backgroundClip = "padding-box"
			cell.style.position = "relative"
			cell.dataset.x = String(x)
			cell.dataset.y = String(y)

			const c: Cell = { el: cell as HTMLDivElement, x, y }

			cell.addEventListener("dragenter", (e) =>
				handleDragOverOrEnter(e as DragEvent, c),
			)
			cell.addEventListener("dragover", (e) =>
				handleDragOverOrEnter(e as DragEvent, c),
			)
			cell.addEventListener("dragleave", () => {
				// optional: don't clear on every leave to avoid flicker
			})
			cell.addEventListener("drop", (e) => handleDrop(e as DragEvent, c))

			// Optional coordinates label
			const label = document.createElement("div")
			label.textContent = `${x},${y}`
			label.style.fontSize = "10px"
			label.style.color = "var(--muted)"
			label.style.textAlign = "center"
			label.style.userSelect = "none"
			label.style.position = "relative"
			label.style.zIndex = "2"
			cell.appendChild(label)

			row.appendChild(cell)
			rowArr.push(c)
		}
		grid.push(rowArr)
		gridEl.appendChild(row)
	}

	// clear preview highlights when leaving the grid
	gridEl.addEventListener("dragleave", (e) => {
		const related = e.relatedTarget as HTMLElement | null
		if (!related || !gridEl.contains(related)) {
			clearHighlights()
		}
	})

	// Pan & Zoom state
	let scale = 1
	let tx = 0
	let ty = 0
	const clamp = (v: number, min: number, max: number) =>
		Math.max(min, Math.min(max, v))
	const applyTransform = () => {
		gridEl.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`
	}
	applyTransform()

	// Wheel to zoom (focus around cursor)
	viewport.addEventListener(
		"wheel",
		(e) => {
			e.preventDefault()
			const rect = viewport.getBoundingClientRect()
			const px = e.clientX - rect.left
			const py = e.clientY - rect.top
			// world coords of cursor before zoom
			const wx = (px - tx) / scale
			const wy = (py - ty) / scale
			const factor = Math.exp(-e.deltaY * 0.001)
			const newScale = clamp(scale * factor, 0.4, 3)
			// keep cursor anchored
			tx = px - wx * newScale
			ty = py - wy * newScale
			scale = newScale
			applyTransform()
		},
		{ passive: false },
	)

	// Panning with middle mouse or while holding Space
	let isPanning = false
	let lastX = 0
	let lastY = 0
	let spaceDown = false
	window.addEventListener("keydown", (e) => {
		if (e.code === "Space") {
			spaceDown = true
			e.preventDefault()
		}
	})
	window.addEventListener("keyup", (e) => {
		if (e.code === "Space") spaceDown = false
	})

	viewport.addEventListener("mousedown", (e) => {
		const target = e.target as HTMLElement
		const onControl = !!target.closest("button")
		if (onControl) return
		// Allow middle button, or left button, or Space modifier
		if (e.button === 1 || e.button === 0 || spaceDown) {
			isPanning = true
			lastX = e.clientX
			lastY = e.clientY
			viewport.style.cursor = "grabbing"
			e.preventDefault()
		}
	})
	window.addEventListener("mousemove", (e) => {
		if (!isPanning) return
		const dx = e.clientX - lastX
		const dy = e.clientY - lastY
		lastX = e.clientX
		lastY = e.clientY
		tx += dx
		ty += dy
		applyTransform()
		e.preventDefault()
	})
	window.addEventListener("mouseup", () => {
		isPanning = false
		viewport.style.cursor = ""
	})
	viewport.addEventListener("contextmenu", (e) => {
		if (isPanning) e.preventDefault()
	})

	// Controls overlay
	const controls = document.createElement("div")
	controls.style.position = "absolute"
	controls.style.top = "8px"
	controls.style.right = "8px"
	controls.style.display = "flex"
	controls.style.gap = "6px"
	const btn = (label: string, onClick: () => void) => {
		const b = document.createElement("button")
		b.textContent = label
		b.style.padding = "6px 8px"
		b.style.border = "1px solid var(--border)"
		b.style.background = "var(--button-bg)"
		b.style.color = "var(--fg)"
		b.style.borderRadius = "6px"
		b.style.cursor = "pointer"
		b.onclick = onClick
		return b
	}
	controls.appendChild(
		btn("-", () => {
			scale = clamp(scale * 0.9, 0.4, 3)
			applyTransform()
		}),
	)
	controls.appendChild(
		btn("+", () => {
			scale = clamp(scale * 1.1, 0.4, 3)
			applyTransform()
		}),
	)
	controls.appendChild(
		btn("Reset", () => {
			scale = 1
			tx = 0
			ty = 0
			applyTransform()
		}),
	)

	viewport.appendChild(gridEl)
	viewport.appendChild(controls)
	root.appendChild(viewport)

	// Expose a small debug helper to spawn an enemy building
	;(window as any).DF_addEnemy = (name: string, x: number, y: number) => {
		const b = allBuildings.find(
			(bb) => bb.name.toLowerCase() === String(name).toLowerCase(),
		)
		if (!b) return false
		return placeEnemy(b, x, y)
	}

	// Update tints when build queue changes
	onBuildQueueChange(() => {
		placed.forEach(applyTint)
	})
	return root
}

export const mapPage = (body: HTMLElement) => {
	withLayout(body, "map", (root) => {
		const row = document.createElement("div")
		row.style.display = "flex"
		row.style.flexDirection = "row"
		row.style.gap = "12px"
		row.appendChild(buildinglist())
		row.appendChild(MapView())
		root.appendChild(row)
	})
}
