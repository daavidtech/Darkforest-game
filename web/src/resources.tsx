import { useCache } from "./cache"

export const ResourcesPage = () => {
	return (
		<div style={{ backgroundColor: "white", display: "inline-block" }}>
			<table>
				<thead>
					<th>Resource</th>
					<th>Amount</th>
				</thead>
				<tbody>
					<tr>
						<td>
							Total Population
						</td>
						<td>
							100
						</td>
					</tr>
					<tr>
						<td>
							Military	
						</td>
						<td>
							20	
						</td>	
					</tr>
					<tr>
						<td>
							Wood
						</td>
						<td>
							42
						</td>
					</tr>	
				</tbody>
			</table>
		</div>
	)
}

export const ResourceTab = (props: {
	name: string
	value: number
}) => {
	return (
		<div style={{ marginRight: "10px", color: "white" }}>
			{props.name}: {props.value.toFixed(0)}
		</div>
	)
}

export const ResourceTabs = () => {
	const { wood, iron, grain } = useCache(m => {
		let wood = 0
		let iron = 0
		let grain = 0

		for (const [, planet] of m.maps) {
			for (const building of planet.buildings) {
				if (!isNaN(building.woodStored)) {
					wood += building.woodStored
				}
				if (!isNaN(building.ironStored)) {
					iron += building.ironStored
				}
				if (!isNaN(building.grainStored)) {
					grain += building.grainStored
				}
			}
		}

		// console.log("grain", grain)

		return {
			wood,
			iron,
			grain
		}
	})

	return (
		<div style={{ display: "flex" }}>
			<ResourceTab name="Wood" value={wood} />
			<ResourceTab name="Iron" value={iron} />
			<ResourceTab name="Grain" value={grain} />
			<ResourceTab name="Innovation" value={55421} />
		</div>
	)
}