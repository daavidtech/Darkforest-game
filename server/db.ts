import { Database } from "bun:sqlite"

export type Rates = { wood: number; iron: number; food: number }

export type BuildingRecord = {
	id: string
	name: string
	x: number
	y: number
	level: number
	owner: string
}

export type UnitRecord = {
	id: string
	type: string
	x: number
	y: number
}

let _db: Database | null = null

const init = () => {
	if (_db) return _db
	_db = new Database("server/darkforest.sqlite", { create: true })
	_db.exec("PRAGMA journal_mode=WAL;")
	_db.exec("PRAGMA foreign_keys=ON;")
	migrate(_db)
	return _db
}

function migrate(db: Database) {
	db.exec(
		`CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at TEXT NOT NULL DEFAULT (datetime('now'))
     );`,
	)

	const applied = new Set<number>()
	for (const row of db.query("SELECT id FROM migrations").all() as {
		id: number
	}[]) {
		applied.add(row.id)
	}

	type Mig = { id: number; name: string; up: (db: Database) => void }
	const migrations: Mig[] = [
		{
			id: 1,
			name: "init",
			up(db) {
				// Schema
				db.exec(`
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
          );
          CREATE TABLE IF NOT EXISTS rates (
            userId TEXT PRIMARY KEY,
            wood REAL NOT NULL,
            iron REAL NOT NULL,
            food REAL NOT NULL,
            FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
          );
          CREATE TABLE IF NOT EXISTS buildings (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            name TEXT NOT NULL,
            x INTEGER NOT NULL,
            y INTEGER NOT NULL,
            level INTEGER NOT NULL,
            owner TEXT NOT NULL,
            FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
          );
          CREATE TABLE IF NOT EXISTS units (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            type TEXT NOT NULL,
            x INTEGER NOT NULL,
            y INTEGER NOT NULL,
            FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
          );
        `)

				// Seed demo data (idempotent)
				const insertUser = db.query(
					"INSERT OR IGNORE INTO users(id, username, password) VALUES(?, ?, ?)",
				)
				insertUser.run("1", "admin", "password")
				insertUser.run("2", "alice", "alicepass")
				insertUser.run("3", "bob", "bobpass")

				const insertRates = db.query(
					"INSERT OR IGNORE INTO rates(userId, wood, iron, food) VALUES(?, ?, ?, ?)",
				)
				insertRates.run("1", 1, 1, 1)
				insertRates.run("2", 2.0, 0.6, 1.2)
				insertRates.run("3", 0.7, 2.2, 1.5)
			},
		},
	]

	for (const m of migrations) {
		if (applied.has(m.id)) continue
		db.exec("BEGIN")
		try {
			m.up(db)
			db.query("INSERT INTO migrations(id, name) VALUES(?, ?)").run(
				m.id,
				m.name,
			)
			db.exec("COMMIT")
		} catch (e) {
			db.exec("ROLLBACK")
			throw e
		}
	}
}

const getUserByUsername = (
	username: string,
): { id: string; username: string; password: string } | null => {
	const row = _db
		.query("SELECT id, username, password FROM users WHERE username = ?")
		.get(username) as
		| { id: string; username: string; password: string }
		| undefined
	return row ?? null
}

const getUserById = (
	id: string,
): { id: string; username: string; password: string } | null => {
	const row = _db
		.query("SELECT id, username, password FROM users WHERE id = ?")
		.get(id) as
		| { id: string; username: string; password: string }
		| undefined
	return row ?? null
}

const createUser = (id: string, username: string, password: string) => {
	_db.query("INSERT INTO users(id, username, password) VALUES(?, ?, ?)").run(
		id,
		username,
		password,
	)
}

const getUserRates = (userId: string): Rates | null => {
	const row = _db
		.query("SELECT wood, iron, food FROM rates WHERE userId = ?")
		.get(userId) as Rates | undefined
	return row ?? null
}

const upsertUserRates = (userId: string, rates: Rates) => {
	_db.query(
		`INSERT INTO rates(userId, wood, iron, food)
     VALUES(?, ?, ?, ?)
     ON CONFLICT(userId) DO UPDATE SET
       wood = excluded.wood,
       iron = excluded.iron,
       food = excluded.food`,
	).run(userId, rates.wood, rates.iron, rates.food)
}

const getUserBuildings = (userId: string): BuildingRecord[] => {
	return _db
		.query(
			"SELECT id, name, x, y, level, owner FROM buildings WHERE userId = ?",
		)
		.all(userId) as BuildingRecord[]
}

const upsertUserBuilding = (userId: string, b: BuildingRecord) => {
	_db.query(
		`INSERT INTO buildings(id, userId, name, x, y, level, owner)
     VALUES(?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       name = excluded.name,
       x = excluded.x,
       y = excluded.y,
       level = excluded.level,
       owner = excluded.owner,
       userId = excluded.userId`,
	).run(b.id, userId, b.name, b.x, b.y, b.level, b.owner)
}

const getUserUnits = (userId: string): UnitRecord[] => {
	return _db
		.query("SELECT id, type, x, y FROM units WHERE userId = ?")
		.all(userId) as UnitRecord[]
}

const upsertUserUnit = (userId: string, u: UnitRecord) => {
	_db.query(
		`INSERT INTO units(id, userId, type, x, y)
     VALUES(?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       type = excluded.type,
       x = excluded.x,
       y = excluded.y,
       userId = excluded.userId`,
	).run(u.id, userId, u.type, u.x, u.y)
}

export const db = {
	init,
	createUser,
	getUserByUsername,
	getUserById,
	getUserRates,
	upsertUserRates,
	getUserBuildings,
	upsertUserBuilding,
	getUserUnits,
	upsertUserUnit,
}
