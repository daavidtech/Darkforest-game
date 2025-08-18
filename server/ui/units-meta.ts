export type UnitSpec = {
	id: string
	name: string
	requiresBuilding: string[] // building names that can train this unit
	trainTimeMs: number
	cost: { wood?: number; iron?: number; food?: number }
}

export const UNIT_SPECS: UnitSpec[] = [
	{
		id: "soldier",
		name: "Soldier",
		requiresBuilding: ["Barrack"],
		trainTimeMs: 4000,
		cost: { wood: 50, food: 20 },
	},
]

export const findUnitSpec = (id: string): UnitSpec | null => {
	const spec = UNIT_SPECS.find((u) => u.id.toLowerCase() === id.toLowerCase())
	return spec ?? null
}

export const trainablesForBuilding = (buildingName: string): UnitSpec[] => {
	const name = buildingName.toLowerCase()
	return UNIT_SPECS.filter((u) =>
		u.requiresBuilding.some((b) => b.toLowerCase() === name),
	)
}
