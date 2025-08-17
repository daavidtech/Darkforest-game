import type { Building } from "./buildinglist"
import { fetchWithAuth } from "./auth"

export type BuildQueueItem = {
	id: string
	building: Building
	origin: { x: number; y: number }
	startedAt: number
	finishAt: number
	status: "building" | "completed"
	action: "build" | "upgrade"
}

const et = new EventTarget()

export type Resources = { wood: number; iron: number; food: number }

const state = {
	buildQueue: [] as BuildQueueItem[],
	resources: { wood: 0, iron: 0, food: 0 } as Resources,
	buildings: [] as {
		id: string
		building: Building
		origin: { x: number; y: number }
		level: number
		owner: "self" | "enemy"
	}[],
}

const emit = () => {
	et.dispatchEvent(
		new CustomEvent("build-queue", { detail: state.buildQueue }),
	)
}

export const getBuildQueue = () => state.buildQueue.slice()

export const onBuildQueueChange = (cb: (items: BuildQueueItem[]) => void) => {
	const handler = (e: Event) =>
		cb((e as CustomEvent).detail as BuildQueueItem[])
	et.addEventListener("build-queue", handler)
	// fire immediately with current state
	cb(getBuildQueue())
	return () => et.removeEventListener("build-queue", handler)
}

const durationFor = (b: Building) => {
	// Simple demo timings by building name
	if (/farm/i.test(b.name)) return 5000
	if (/barrack/i.test(b.name)) return 8000
	if (/school/i.test(b.name)) return 10000
	return 6000
}

export const enqueueBuild = (
	building: Building,
	origin: { x: number; y: number },
	action: "build" | "upgrade" = "build",
) => {
	const now = Date.now()
	const existing = getPlacedAt(origin.x, origin.y)
	const level = existing?.level ?? 1
	const base = durationFor(building)
	const dur =
		action === "upgrade" ? Math.round(base * (1 + 0.5 * (level - 1))) : base
	const item: BuildQueueItem = {
		id: `${action}-${building.name}-${origin.x}-${origin.y}-${now}`,
		building,
		origin,
		startedAt: now,
		finishAt: now + dur,
		status: "building",
		action,
	}
	state.buildQueue.push(item)
	emit()

	const remaining = item.finishAt - Date.now()
	setTimeout(
		() => {
			const it = state.buildQueue.find((q) => q.id === item.id)
			if (it && it.status === "building") {
				it.status = "completed"
				emit()
				if (item.action === "upgrade") {
					const pb = getPlacedAt(item.origin.x, item.origin.y)
					if (pb) {
						pb.level += 1
						emitBuildings()
					}
				}
			}
		},
		Math.max(0, remaining),
	)

	return item
}

// Resources API
export const getResources = () => ({ ...state.resources })

export const onResourcesChange = (cb: (r: Resources) => void) => {
	const handler = (e: Event) => cb({ ...(e as CustomEvent).detail })
	et.addEventListener("resources", handler)
	cb(getResources())
	return () => et.removeEventListener("resources", handler)
}

const emitResources = () => {
	et.dispatchEvent(new CustomEvent("resources", { detail: getResources() }))
}

// very simple resource tick; rates can be provided by server per user
let lastTick = Date.now()
let baseRates: Resources = { wood: 1, iron: 1, food: 1 } // per second
setInterval(() => {
	const now = Date.now()
	const dt = Math.max(0, now - lastTick) / 1000
	lastTick = now
	state.resources.wood += baseRates.wood * dt
	state.resources.iron += baseRates.iron * dt
	state.resources.food += baseRates.food * dt
	emitResources()
}, 250)

export const loadResourceRates = async () => {
	try {
		const res = await fetchWithAuth("/api/rates")
		if (!res.ok) return
		const data = await res.json()
		const r = data.rates as Resources
		if (r && typeof r.wood === "number") baseRates.wood = r.wood
		if (r && typeof r.iron === "number") baseRates.iron = r.iron
		if (r && typeof r.food === "number") baseRates.food = r.food
	} catch {}
}

// Buildings registry helpers
export const addPlacedBuilding = (
	building: Building,
	origin: { x: number; y: number },
	owner: "self" | "enemy" = "self",
) => {
	const id = `${building.name}-${origin.x}-${origin.y}`
	const exists = state.buildings.find((b) => b.id === id)
	if (!exists) {
		state.buildings.push({ id, building, origin, level: 1, owner })
		emitBuildings()
	}
}

export const getPlacedBuildings = () => state.buildings.slice()
export const getPlacedAt = (x: number, y: number) =>
	state.buildings.find((b) => b.origin.x === x && b.origin.y === y) || null

const emitBuildings = () => {
	et.dispatchEvent(
		new CustomEvent("buildings", { detail: getPlacedBuildings() }),
	)
}

export const onBuildingsChange = (
	cb: (items: ReturnType<typeof getPlacedBuildings>) => void,
) => {
	const handler = (e: Event) => cb((e as CustomEvent).detail)
	et.addEventListener("buildings", handler)
	cb(getPlacedBuildings())
	return () => et.removeEventListener("buildings", handler)
}

export const requestUpgradeAt = (x: number, y: number) => {
	const pb = getPlacedAt(x, y)
	if (!pb) return null
	const inProgress = state.buildQueue.find(
		(q) => q.origin.x === x && q.origin.y === y && q.status === "building",
	)
	if (inProgress) return inProgress
	return enqueueBuild(pb.building, pb.origin, "upgrade")
}
