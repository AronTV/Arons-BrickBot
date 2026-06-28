const Database = require("better-sqlite3");
const path = require("path");

// DB Datei
const db = new Database(path.join(__dirname, "database.sqlite"));

// Tabelle erstellen (falls nicht existiert)
db.prepare(`
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT,
    manufacturer TEXT,
    image TEXT,
    setdb_price REAL,
    setdb_url TEXT,
    bluebrixx_price REAL,
    bluebrixx_url TEXT,
    bluebrixx_status TEXT
)
`).run();

module.exports = db;