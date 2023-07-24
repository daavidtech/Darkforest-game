import React, { useEffect, useState } from "react"



export const Map = (prosps: {
	buildings: any[]
	activeBuilding: any[]
	onBuildingSet: (p: any) => void
}) => {
	const currentCoordinate = useState({ x: 0, y: 0 })

	useEffect(() => {
		function onMouseMove(e: MouseEvent) {
		
		}

		window.addEventListener("mousemove", onMouseMove)

		return () => {
			window.removeEventListener("mousemove", onMouseMove)
		}
	}, [currentCoordinate])

	const rows = []

	for (let i = 0; i < 5; i++) {
		const columns: any[] = []
		
		for (let j = 0; j < 5; j++) {
			columns.push(<div style={{ width: "80px", height: "80px", textAlign: "center" }}>{i}:{j}</div>)
		}

		rows.push(<div style={{
			display: "flex",
			flexDirection: "row"
		}}>
			{columns}
		</div>)
	}

	return <div>
		{rows}
	</div>
}