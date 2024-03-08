import { useEffect, useState } from "react"
import { MapGrid } from "./types"

export const cache = {
	newBuildingId: 1,
	mapSize: 5,
	maps: new Map<number, MapGrid>(),
}

cache.maps.set(1, {
	buildings: []
})

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