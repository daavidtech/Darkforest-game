import type { Building } from "./buildinglist"
import { buildinglist } from "./buildinglist"

const GRID_W = 20
const GRID_H = 20
const CELL = 60
const mime = "application/x-darkforest-building"

type Cell = { el: HTMLDivElement; x: number; y: number }

const inBounds = (x: number, y: number) => x >= 0 && y >= 0 && x < GRID_W && y < GRID_H

export type PlacedBuilding = {
    building: Building
    origin: { x: number; y: number }
}

const MapView = () => {
    const root = document.createElement("div")
    root.style.display = "flex"
    root.style.flexDirection = "column"
    root.style.gap = "0px"

    // state
    const grid: Cell[][] = []
    const occupied = new Set<string>() // key `${x},${y}`
    const placed: PlacedBuilding[] = []

    const gridEl = document.createElement("div")
    gridEl.style.display = "flex"
    gridEl.style.flexDirection = "column"
    gridEl.style.userSelect = "none"

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
        building.shape.forEach(({ x, y }) => {
            const cx = origin.x + x
            const cy = origin.y + y
            if (!inBounds(cx, cy)) return
            const cell = grid[cy][cx].el
            cell.style.backgroundImage = `url(${building.img})`
            cell.style.backgroundSize = `${CELL * 2}px ${CELL * 2}px`
            // Position the sprite so that (origin) aligns to top-left of the composite image
            cell.style.backgroundPosition = `${-x * CELL}px ${-y * CELL}px`
            cell.style.backgroundRepeat = "no-repeat"
        })
    }

    const place = (building: Building, ox: number, oy: number) => {
        building.shape.forEach(({ x, y }) => occupied.add(makeKey(ox + x, oy + y)))
        const pb: PlacedBuilding = { building, origin: { x: ox, y: oy } }
        placed.push(pb)
        renderBuilding(pb)
    }

    const handleDragOverOrEnter = (e: DragEvent, cell: Cell) => {
        const building = getDraggedBuilding(e.dataTransfer)
        if (!building) return
        e.preventDefault()
        e.dataTransfer!.dropEffect = "copy"
        const previewCells = building.shape.map((p) => ({ x: cell.x + p.x, y: cell.y + p.y }))
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
            cell.style.border = "1px solid #ccc"
            cell.style.display = "inline-block"
            cell.style.boxSizing = "border-box"
            cell.style.backgroundColor = "#fff"
            cell.style.backgroundClip = "padding-box"
            cell.dataset.x = String(x)
            cell.dataset.y = String(y)

            const c: Cell = { el: cell as HTMLDivElement, x, y }

            cell.addEventListener("dragenter", (e) => handleDragOverOrEnter(e as DragEvent, c))
            cell.addEventListener("dragover", (e) => handleDragOverOrEnter(e as DragEvent, c))
            cell.addEventListener("dragleave", () => {
                // optional: don't clear on every leave to avoid flicker
            })
            cell.addEventListener("drop", (e) => handleDrop(e as DragEvent, c))

            // Optional coordinates label
            const label = document.createElement("div")
            label.textContent = `${x},${y}`
            label.style.fontSize = "10px"
            label.style.color = "#aaa"
            label.style.textAlign = "center"
            label.style.userSelect = "none"
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

    root.appendChild(gridEl)
    return root
}

export const mapPage = (body: HTMLElement) => {
    body.style.display = "flex"
    body.style.flexDirection = "row"
    body.style.gap = "12px"
    body.innerHTML = ""
    body.appendChild(buildinglist())
    body.appendChild(MapView())
}