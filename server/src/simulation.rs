use crate::types::Building;
use crate::types::GameWorld;
use crate::types::Planet;

fn simulate_building(building: &mut Building, delta_seconds: u32) {

}

fn simulate_planet(planet: &mut Planet, delta_seconds: u32) {
	for unit in &planet.units {

	}
}

pub fn simulate(world: &mut GameWorld, delta_seconds: u32) {
	for planet in &world.planets {
		for building in &planet.buildings {

		}
	}
}