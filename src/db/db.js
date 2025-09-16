import Database from "better-sqlite3"

const db = new Database('app.db');
db.pragma('foreign_keys = ON');  // 🔑 activa las relaciones
db.exec(`
  CREATE TABLE IF NOT EXISTS congregations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  );
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullname TEXT,
    username TEXT,
    password TEXT,
    congregation_id INTEGER,
    FOREIGN KEY (congregation_id) REFERENCES congregations(id)
  );
  CREATE TABLE IF NOT EXISTS assembly_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  );
  CREATE TABLE IF NOT EXISTS assemblies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type_id INTEGER,
    congregation_id INTEGER,
    created_by INTEGER,
    FOREIGN KEY (type_id) REFERENCES assembly_types(id),
    FOREIGN KEY (congregation_id) REFERENCES congregations(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS assembly_days (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assembly_id INTEGER,
    date TEXT,
    transport_total_cost REAL,
    bus_total_seats INTEGER,
    bus_departure_time TEXT,
    has_privileges INTEGER CHECK (has_privileges IN (0,1)),
    ticket_cost REAL,
    FOREIGN KEY (assembly_id) REFERENCES assemblies(id)
  );
  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assembly_day_id INTEGER,
    representative_name TEXT,
    tickets_count INTEGER,
    amount_paid REAL,
    FOREIGN KEY (assembly_day_id) REFERENCES assembly_days(id)
  );
`);
export default db;