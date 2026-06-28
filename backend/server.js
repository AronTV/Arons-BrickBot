const express = require("express");
const path = require("path");
const axios = require("axios");

const db = require("./db");
const { fetchProduct } = require("./setdb.service");

const app = express();

app.use(express.json());

/* =========================
   FRONTEND SERVING
========================= */
app.use(express.static(path.join(__dirname, "../frontend")));

/* =========================
   SEARCH ROUTE
========================= */
app.get("/api/search/:id", async (req, res) => {

    const id = req.params.id;

    try {
        // 🔎 DB CHECK (sync - better-sqlite3)
        const row = db.prepare(
            "SELECT * FROM products WHERE id = ?"
        ).get(id);

        if (row) {
            return res.json({
                success: true,
                data: normalize(row)
            });
        }

        // 🌐 SCRAPE / FETCH
        const p = await fetchProduct(id);

        // 💾 SAVE TO DB
        db.prepare(`
            INSERT OR REPLACE INTO products (
                id,
                name,
                manufacturer,
                image,
                setdb_price,
                setdb_url,
                bluebrixx_price,
                bluebrixx_url,
                bluebrixx_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            p.id,
            p.name,
            p.manufacturer,
            p.image,
            p.setdb.price,
            p.setdb.url,
            p.bluebrixx.price,
            p.bluebrixx.url,
            p.bluebrixx.status
        );

        return res.json({
            success: true,
            data: p
        });

    } catch (err) {
        return res.json({
            success: false,
            error: err.message
        });
    }
});

/* =========================
   IMAGE PROXY (fix CORS issues)
========================= */
app.get("/api/image", async (req, res) => {

    try {
        const url = req.query.url;

        const img = await axios.get(url, {
            responseType: "arraybuffer"
        });

        res.setHeader("Content-Type", "image/jpeg");
        res.send(img.data);

    } catch (err) {
        res.status(500).send("image error");
    }
});

/* =========================
   NORMALIZE DB ROW
========================= */
function normalize(row) {
    return {
        id: row.id,
        name: row.name,
        manufacturer: row.manufacturer,
        image: row.image,
        setdb: {
            price: row.setdb_price ?? null,
            url: row.setdb_url ?? null
        },
        bluebrixx: {
            price: row.bluebrixx_price ?? null,
            url: row.bluebrixx_url ?? null,
            status: row.bluebrixx_status ?? "unknown"
        }
    };
}

/* =========================
   RENDER SAFE START
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("🧱 BrickBot läuft auf Port " + PORT);
});