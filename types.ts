
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
}

export type Village = {

}

export type MapGrid = {
	buildings: Building[]
}