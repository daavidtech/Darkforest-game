import { Unit, Vehicle } from "../../types"

export class GayDate {
	public year: number
	public month: number
	public day: number
	public hour: number
	public minute: number
	public second: number

	public constructor() {

	}

	public elapsed(): number {
		return 0
	}
}

export class BattleParty {
	units: Unit[]
	vehicles: Vehicle[]

	public speed() {
		return 0
	}
}

export type SimulationResult = {
	subSimulations: BattleSimulation[]
	nextWakeupTime: GayDate
	battleDone: boolean
}

const findUnitsInRange = (units: Unit[], distance: number): Unit[] => {
	const unitsInRange = []

	for (const unit of units) {
		if (unit.attackRange < distance) {
			unitsInRange.push(unit)
		}
	}

	return unitsInRange
}



export class BattleSimulation {
	private party1: BattleParty
	private party2: BattleParty
	private distance: number = 0
	private lastWakeupTime: GayDate = new GayDate()

	constructor(party1: BattleParty, party2: BattleParty) {
		this.party1 = party1
		this.party2 = party2
	}

	/**
	 * Simulate battle and return the next wakeup time
	 */
	public simulate(): SimulationResult {
		if (this.party1.units.length === 0 || this.party2.units.length === 0) {
			return {
				subSimulations: [],
				battleDone: true,
				nextWakeupTime: new GayDate()
			}
		}

		const party1UnitsInRange = findUnitsInRange(this.party1.units, this.distance)
		const party2UnitsInRange = findUnitsInRange(this.party2.units, this.distance)

		if (party1UnitsInRange.length === 0 && party2UnitsInRange.length === 0) {
			const party1Speed = this.party1.speed()
			const party2Speed = this.party2.speed()
			const speed = party1Speed + party2Speed

			

			return {
				subSimulations: [],
				battleDone: true,
				nextWakeupTime: new GayDate()
			}
		}


		return {
			battleDone: false,
			subSimulations: [],
			nextWakeupTime: new GayDate()
		}
	}
}