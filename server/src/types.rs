use std::collections::HashMap;
use std::collections::HashSet;

pub struct Coordinate {
	pub planet: u32,
	pub x: u32,
	pub y: u32,
}

pub enum Location {
	Building,
	Coordinate(Coordinate)
}

pub struct Unit {
	pub utype: u32,
	pub location: Location,
	pub moving_to: Option<Coordinate>,
	pub attack_damage: u32,
	pub health: u32,
	pub accuracy: u32,
	pub attack_range: u32,
	pub move_speed: u32,
}

pub struct GameDate {
	pub year: u32,
	pub month: u32,
	pub day: u32,
	pub hour: u32,
	pub minute: u32,
	pub second: u32,
}

pub struct Battle {
	pub attacker: Unit,
	pub defender: Unit
}

pub struct Movement {
	pub unit: Vec<Unit>,
	pub destination: Coordinate
}

pub struct BuildingShape {
	pub points: Vec<Coordinate>
}

pub struct ResourceProd {
	pub resource: String,
	pub rate: u32
}

pub struct Building {
	pub owner: u32,
	pub construction_done_at: Option<GameDate>,
	pub health: u32,
	pub shape: BuildingShape,
	pub resource_prods: HashMap<String, u32>,
	pub resource_stored: HashMap<String, u32>,
	pub max_resource_storage: HashMap<String, u32>,
}

pub struct Player {
	pub id: u32,
	// What things player has found in the tech tree
	pub tech_tree: HashSet<String>
}

pub struct Planet {
	pub buildings: Vec<Building>,
	pub units: Vec<Unit>,
}

pub struct GameWorld {
	pub planets: Vec<Planet>,
	pub players: Vec<Player>,
	pub date: GameDate
}