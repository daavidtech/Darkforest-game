import { cache, notifyChanges } from "./cache"

export const startProduction = () => {
	setInterval(() => {
		for (const map of cache.maps.values()) {
			for (const building of map.buildings) {
				if (building.contructionDoneAt) {
					if (building.contructionDoneAt < new Date()) {
						building.contructionDoneAt = undefined
					}

					continue
				}

				const delta = building.lastUpdated ? (new Date().getTime() - building.lastUpdated.getTime()) / 1000 : 0

				if (building.woodProduction) {
					if (isNaN(building.woodStored)) {
						building.woodStored = 0
					}

					building.woodStored += building.woodProduction * delta
				}

				if (building.stoneProduction) {
					building.stoneStorage += building.stoneProduction
				}

				if (building.ironProduction) {
					if (isNaN(building.ironStored)) {
						building.ironStored = 0
					}

					building.ironStored += building.ironProduction * delta
				}

				if (building.grainProduction) {
					if (isNaN(building.grainStored)) {
						building.grainStored = 0
					}

					building.grainStored += building.grainProduction * delta
				}

				building.lastUpdated = new Date()
			}
		}

		notifyChanges()
	}, 2000)
}