const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./data.db");

db.serialize(() => {
    db.run(`
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
    `);
});

module.exports = db;