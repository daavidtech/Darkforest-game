import { useEffect, useState } from "react"

export type Building = {
	buildingId?: number
	x: number
	y: number
	width: number
	height: number
	level: number
	contructionDoneAt: Date
}

export const cache = {
	newBuildingId: 1,
	mapSize: 5,
    mapBuildings: new Map<number, Building[]>()
}

cache.mapBuildings.set(1, [])

const listeners = new Set<() => void>()

export const notifyChanges = () => {
    for (const listener of listeners) {
        listener()
    }
}

export const useCache = <T>(mapper: (state: typeof cache) => T) => {
    const [state, setState] = useState<T>(mapper(cache))

    useEffect(() => {
        const listener = () => {
            setState(mapper(cache))
        }

        listeners.add(listener)

        return () => {
            listeners.delete(listener)
        }
    }, [mapper, setState])

    return state
}