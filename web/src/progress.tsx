import { DateTime } from "luxon"
import { Building, cache, notifyChanges, useCache } from "./cache"
import { useEffect, useState } from "react"

const BuildingProgress = (props: { 
	building: Building
	onCancel: () => void
}) => {
	const [progress, setProgress] = useState(0)
	const [timeLeft, setTimeLeft] = useState("")

	useEffect(() => {
		const interval = setInterval(() => {
			const now = DateTime.now()
			const diff = props.building.contructionDoneAt.getTime() - now.toJSDate().getTime()
			const total = now.plus({ minutes: 30 }).toJSDate().getTime() - now.toJSDate().getTime()
			const percent = Math.floor((diff / total) * 100)
			setProgress(percent)

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

		for (const [mapId,mapBuildings] of m.mapBuildings) {
			for (const building of mapBuildings) {
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
					onCancel={() => {
						const mapBuildings = cache.mapBuildings.get(b.mapId)

						if (mapBuildings) {
							const index = mapBuildings.findIndex(p => p.buildingId === b.building.buildingId)

							if (index !== -1) {
								mapBuildings.splice(index, 1)
							}
						}

						notifyChanges()
					}} />
			})}
		</div>
	)
}