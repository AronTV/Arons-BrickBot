const express = require("express");
const path = require("path");
const axios = require("axios");

const db = require("./db");
const { fetchProduct } = require("./setdb.service");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

/* =========================
   SEARCH
========================= */
app.get("/api/search/:id", async (req, res) => {

    const id = req.params.id;

    try {
        const row = db.prepare(
            "SELECT * FROM products WHERE id = ?"
        ).get(id);

        if (row) {
            return res.json({
                success: true,
                data: normalize(row)
            });
        }

        const p = await fetchProduct(id);

        db.prepare(`
            INSERT OR REPLACE INTO products (
                id, name, manufacturer, image,
                ean, parts, minifigures, age,
                dimensions, weight, year, theme, rating,
                setdb_price, setdb_url,
                bluebrixx_price, bluebrixx_url, bluebrixx_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            p.id,
            p.name,
            p.manufacturer,
            p.image,
            p.ean,
            p.parts,
            p.minifigures,
            p.age,
            p.dimensions,
            p.weight,
            p.year,
            p.theme,
            p.rating,
            p.setdb.price,
            p.setdb.url,
            p.bluebrixx.price,
            p.bluebrixx.url,
            p.bluebrixx.status
        );

        res.json({ success: true, data: p });

    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

/* =========================
   IMAGE PROXY
========================= */
app.get("/api/image", async (req, res) => {
    try {
        const img = await axios.get(req.query.url, {
            responseType: "arraybuffer"
        });

        res.setHeader("Content-Type", "image/jpeg");
        res.send(img.data);

    } catch {
        res.status(500).send("image error");
    }
});

/* =========================
   NORMALIZE
========================= */
function normalize(row) {
    return {
        id: row.id,
        name: row.name,
        manufacturer: row.manufacturer,
        image: row.image,

        ean: row.ean ?? null,
        parts: row.parts ?? null,
        minifigures: row.minifigures ?? null,
        age: row.age ?? null,
        dimensions: row.dimensions ?? null,
        weight: row.weight ?? null,
        year: row.year ?? null,
        theme: row.theme ?? null,
        rating: row.rating ?? null,

        pricePerPart:
            row.parts && row.setdb_price
                ? (row.setdb_price / row.parts).toFixed(3)
                : null,

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
   START
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("🧱 BrickBot läuft auf Port " + PORT);
});