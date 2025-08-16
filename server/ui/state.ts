import type { Building } from "./buildinglist"

export type BuildQueueItem = {
    id: string
    building: Building
    origin: { x: number; y: number }
    startedAt: number
    finishAt: number
    status: "building" | "completed"
}

const et = new EventTarget()

export type Resources = { wood: number; iron: number; food: number }

const state = {
    buildQueue: [] as BuildQueueItem[],
    resources: { wood: 0, iron: 0, food: 0 } as Resources,
}

const emit = () => {
    et.dispatchEvent(new CustomEvent("build-queue", { detail: state.buildQueue }))
}

export const getBuildQueue = () => state.buildQueue.slice()

export const onBuildQueueChange = (
    cb: (items: BuildQueueItem[]) => void,
) => {
    const handler = (e: Event) => cb((e as CustomEvent).detail as BuildQueueItem[])
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

export const enqueueBuild = (building: Building, origin: { x: number; y: number }) => {
    const now = Date.now()
    const dur = durationFor(building)
    const item: BuildQueueItem = {
        id: `${building.name}-${origin.x}-${origin.y}-${now}`,
        building,
        origin,
        startedAt: now,
        finishAt: now + dur,
        status: "building",
    }
    state.buildQueue.push(item)
    emit()

    const remaining = item.finishAt - Date.now()
    setTimeout(() => {
        const it = state.buildQueue.find((q) => q.id === item.id)
        if (it && it.status === "building") {
            it.status = "completed"
            emit()
        }
    }, Math.max(0, remaining))

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

// very simple resource tick; later can be tied to buildings
let lastTick = Date.now()
const baseRates: Resources = { wood: 1, iron: 1, food: 1 } // per second
setInterval(() => {
    const now = Date.now()
    const dt = Math.max(0, now - lastTick) / 1000
    lastTick = now
    state.resources.wood += baseRates.wood * dt
    state.resources.iron += baseRates.iron * dt
    state.resources.food += baseRates.food * dt
    emitResources()
}, 250)
