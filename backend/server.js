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
app.get("/api/search/:id", (req, res) => {

    const id = req.params.id;

    db.get("SELECT * FROM products WHERE id = ?", [id], async (err, row) => {

        if (row) {
            return res.json({
                success: true,
                data: normalize(row)
            });
        }

        try {
            const p = await fetchProduct(id);

            db.run(`
                INSERT OR REPLACE INTO products VALUES (?,?,?,?,?,?,?,?,?)
            `, [
                p.id,
                p.name,
                p.manufacturer,
                p.image,
                p.setdb.price,
                p.setdb.url,
                p.bluebrixx.price,
                p.bluebrixx.url,
                p.bluebrixx.status
            ]);

            res.json({ success: true, data: p });

        } catch (e) {
            res.json({ success: false, error: e.message });
        }
    });
});

/* =========================
   IMAGE PROXY (WICHTIG!)
========================= */
app.get("/api/image", async (req, res) => {

    try {
        const img = await axios.get(req.query.url, {
            responseType: "arraybuffer"
        });

        res.set("Content-Type", "image/webp");
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

app.listen(3000, () => console.log("V4 STABLE läuft"));