import { DateTime } from "luxon"
import { cache, notifyChanges, useCache } from "./cache"
import { useEffect, useState } from "react"
import { Building } from "../../types"

const BuildingProgress = (props: { 
	building: Building
	onReady: () => void
	onCancel: () => void
}) => {
	const [timeLeft, setTimeLeft] = useState("")

	useEffect(() => {
		const interval = setInterval(() => {
			const now = DateTime.now()
			const diff = props.building.contructionDoneAt.getTime() - now.toJSDate().getTime()

			let minutes: number | string = Math.floor(diff / 1000 / 60)
			let seconds: number | string = Math.floor(diff / 1000 % 60)

			if (minutes < 10) {
				minutes = "0" + minutes
			}

			if (seconds < 10) {
				seconds = "0" + seconds
			}

			setTimeLeft(`${minutes}:${seconds}`)
		}, 1000)

		return () => {
			clearInterval(interval)
		}
	}, [props.building])

	return (
		<div style={{ color: "white" }}>
			{props.building.name}{" "} 
			{timeLeft}
			<span style={{ fontSize: "25px", marginLeft: "10px", cursor: "pointer" }} onClick={props.onCancel}>
				&times;
			</span>
		</div>
	)
}

export const BuildingProgresses = () => {
	const { buildings } = useCache(m => {
		const buildings: {
			mapId: number
			building: Building	
		}[] = []

		for (const [mapId, planet] of m.maps) {
			for (const building of planet.buildings) {
				if (building.contructionDoneAt) {
					buildings.push({
						mapId,
						building
					})
				}
			}
		}

		return {
			buildings
		}
	})

	
	return (
		<div style={{ padding: "10px" }}>
			{buildings.map((b, i) => {
				return <BuildingProgress key={i} building={b.building}
					onReady={() => {
						b.building.contructionDoneAt = undefined
						notifyChanges()
					}}
					onCancel={() => {
						const map = cache.maps.get(b.mapId)

						if (map) {
							const index = map.buildings.findIndex(p => p.buildingId === b.building.buildingId)

							if (index !== -1) {
								map.buildings.splice(index, 1)
							}
						}

						notifyChanges()
					}} />
			})}
		</div>
	)
}