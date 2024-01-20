
type UnitType = "Nuijamies" | "Worker"
type VehicleType = "Horse" | "Bus"

type Target = {
	x: number
	y: number
}

type UnitMovement = {
	units: Unit[]
	target: Target
}

type Unit = {
	id: number
	type: UnitType
	health: number
	attackDamage: number
}

type UnitBlueprint = {
	type: UnitType
	level: number
	population: number
	woodCost: number
	ironCost: number
}

type Vehicle = {
	type: VehicleType
	carries: Unit[]
	health: number
}

type VehicleBlueprint = {
	type: VehicleType
	level: number
	woodCost: number
	ironCost: number
}

type TrainingUnit = {
	unitType: string
	trainingDoneAt: Date
}

export type Building = {
	buildingId?: number
	x: number
	y: number
	width: number
	height: number
	level: number
	name: string
	contructionDoneAt: Date
	woodStored?: number
	woodProduction?: number
	stoneStorage?: number
	stoneProduction?: number
	ironStored?: number
	ironProduction?: number
	maxPeopleCount?: number
	workerCount?: number
	militaryCount?: number
	grainStored?: number
	grainProduction?: number
	lastUpdated?: Date
	trainingUnits: TrainingUnit[]
}

export type Village = {

}

export type MapGrid = {
	buildings: Building[]
}