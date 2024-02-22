use std::collections::HashSet;

pub struct Coordinate {
	pub x: u32,
	pub y: u32,
}

pub struct Unit {
	pub coordinate: Coordinate,
	pub attack_damage: u32,
	pub health: u32,
	pub accuracy: u32,
	pub attack_range: u32,
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

pub struct Building {
	pub construction_done_at: Option<GameDate>,
	pub health: u32,
	pub shape: BuildingShape
}

pub struct Player {
	// What things player has found in the tech tree
	pub tech_tree: HashSet<String>
}

pub struct Map {
	pub buildings: Vec<Building>,
	pub units: Vec<Unit>,
}

pub struct GameWorld {
	pub map: Map,
	pub players: Vec<Player>,
	pub date: GameDate
}