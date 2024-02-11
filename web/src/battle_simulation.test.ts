import { expect, test } from "bun:test";
import { BattleParty, BattleSimulation } from "./battle_simlation";

test("Simple battle", () => {
	const party1: BattleParty = {
		units: [],
		vehicles: []
	}
	const party2: BattleParty = {
		units: [],
		vehicles: []
	}

	const sim = new BattleSimulation(party1, party2)

	const { battleDone } = sim.simulate()

	expect(battleDone).toBe(true)
})

test("Next wakeup time", () => {
	const party1: BattleParty = {
		units: [],
		vehicles: []
	}
	const party2: BattleParty = {
		units: [],
		vehicles: []
	}

	const sim = new BattleSimulation(party1, party2)

	const { nextWakeupTime } = sim.simulate()

	expect(nextWakeupTime).toBeInstanceOf(Date)
})