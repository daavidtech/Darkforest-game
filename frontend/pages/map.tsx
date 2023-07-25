import { Map } from "@/src/map"
import React, { Fragment, useEffect, useState } from "react"



export default function MapPage(prosps: {
	buildings: any[]
	activeBuilding: any[]
}) {
	const [active, setActive] = useState(false)
	const [buildings, setBuildings] = useState([])

	return (
		<Fragment>
			<button onClick={() => setActive(!active)}>
				Rakennus
			</button>
			<Map
				active={active}
				rowsCount={5}
				columnsCount={5}
				onBuildingSet={(p) => {
					// DO something
				}}
				activeBuilding={[]}
				buildings={[]}
			/>
		</Fragment>
	)
}