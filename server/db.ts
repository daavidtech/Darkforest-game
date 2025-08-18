import { Database } from "bun:sqlite"

export type Rates = { wood: number; iron: number; food: number }

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
            username TEXT PRIMARY KEY,
            password TEXT NOT NULL
          );
          CREATE TABLE IF NOT EXISTS rates (
            username TEXT PRIMARY KEY,
            wood REAL NOT NULL,
            iron REAL NOT NULL,
            food REAL NOT NULL,
            FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE
          );
        `)

				// Seed demo data (idempotent)
				const insertUser = db.query(
					"INSERT OR IGNORE INTO users(username, password) VALUES(?, ?)",
				)
				insertUser.run("admin", "password")
				insertUser.run("alice", "alicepass")
				insertUser.run("bob", "bobpass")

				const insertRates = db.query(
					"INSERT OR IGNORE INTO rates(username, wood, iron, food) VALUES(?, ?, ?, ?)",
				)
				insertRates.run("admin", 1, 1, 1)
				insertRates.run("alice", 2.0, 0.6, 1.2)
				insertRates.run("bob", 0.7, 2.2, 1.5)
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

const getUser = (
	username: string,
): { username: string; password: string } | null => {
	const row = _db
		.query("SELECT username, password FROM users WHERE username = ?")
		.get(username) as { username: string; password: string } | undefined
	return row ?? null
}

const createUser = (username: string, password: string) => {
	_db.query("INSERT INTO users(username, password) VALUES(?, ?)").run(
		username,
		password,
	)
}

const getUserRates = (username: string): Rates | null => {
	const row = _db
		.query("SELECT wood, iron, food FROM rates WHERE username = ?")
		.get(username) as Rates | undefined
	return row ?? null
}

const upsertUserRates = (username: string, rates: Rates) => {
	_db.query(
		`INSERT INTO rates(username, wood, iron, food)
     VALUES(?, ?, ?, ?)
     ON CONFLICT(username) DO UPDATE SET
       wood = excluded.wood,
       iron = excluded.iron,
       food = excluded.food`,
	).run(username, rates.wood, rates.iron, rates.food)
}

export const db = {
	init,
	createUser,
	getUser,
	getUserRates,
	upsertUserRates,
}
