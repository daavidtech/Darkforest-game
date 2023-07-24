import { Map } from "@/src/map"
import React, { useEffect, useState } from "react"



export default function MapPage(prosps: {
	buildings: any[]
	activeBuilding: any[]
}) {

	return (
		<Map
			onBuildingSet={(p) => {
				// DO something
			}}
			activeBuilding={[]}
			buildings={[]}
		/>
	)
}