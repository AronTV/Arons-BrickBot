const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "database.sqlite"));

/* =========================
   TABLE ERSTELLEN (NEU INSTALLS)
========================= */
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

/* =========================
   MIGRATION (EXISTING DBs FIX)
   -> fügt fehlende Spalten hinzu
========================= */

const cols = db.prepare("PRAGMA table_info(products)").all();
const existing = cols.map(c => c.name);

const addColumn = (name, type) => {
    if (!existing.includes(name)) {
        db.prepare(`ALTER TABLE products ADD COLUMN ${name} ${type}`).run();
    }
};

/* Neue Felder */
addColumn("ean", "TEXT");
addColumn("parts", "INTEGER");
addColumn("minifigures", "INTEGER");
addColumn("age", "TEXT");
addColumn("dimensions", "TEXT");
addColumn("weight", "TEXT");
addColumn("year", "TEXT");
addColumn("theme", "TEXT");
addColumn("rating", "REAL");

/* =========================
   EXPORT DB
========================= */
module.exports = db;