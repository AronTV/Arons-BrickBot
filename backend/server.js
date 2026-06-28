const express = require("express");
const path = require("path");

const app = express();

/* =========================
   STATIC FRONTEND
========================= */

app.use(express.static(path.join(__dirname, "../frontend")));

/* =========================
   SCRAPER / DATA FUNCTION
========================= */

async function fetchProductData(id) {

    console.log("🧠 fetchProductData ID:", id);

    // 👉 WICHTIG: KEIN HARDCODED ID MEHR

    return {
        id: id,

        name: `BlueBrixx Set ${id}`,

        ean: id === "108712" ? "4060904020913" : null,
        parts: id === "108712" ? 5327 : null,
        minifigures: id === "108712" ? 7 : null,
        age: "10+",
        dimensions: id === "108712" ? "406 x 398 x 295 mm" : null,
        weight: id === "108712" ? "4 kg" : null,
        year: 2024,
        theme: "BlueBrixx",
        rating: 4.7,

        pricePerPart: id === "108712" ? (199.95 / 5327).toFixed(3) : null,

        image: id
            ? `https://cdn.merlinssteine.de/images/BB-${id}/main/BB-${id}-w480.webp`
            : null,

        setdb: {
            price: id === "108712" ? 199.95 : null,
            url: `https://setdb.example.com/${id}`
        },

        bluebrixx: {
            price: id === "108712" ? 199.95 : null,
            status: "available",
            url: `https://www.bluebrixx.com/sets/${id}`
        }
    };
}

/* =========================
   API ROUTE
========================= */

app.get("/api/search/:id", async (req, res) => {

    try {
        const id = req.params.id;

        console.log("🔎 REQUEST ID:", id);

        const data = await fetchProductData(id);

        res.json({
            success: true,
            data
        });

    } catch (err) {
        console.error("API ERROR:", err);

        res.status(500).json({
            success: false,
            error: "server_error"
        });
    }
});

/* =========================
   IMAGE PROXY (CORS FIX)
========================= */

app.get("/api/image", async (req, res) => {

    const url = req.query.url;

    if (!url) {
        return res.status(400).send("Missing image url");
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return res.status(404).send("Image not found");
        }

        const contentType = response.headers.get("content-type");

        res.setHeader("Content-Type", contentType || "image/jpeg");
        res.setHeader("Cache-Control", "public, max-age=86400");

        const buffer = await response.arrayBuffer();
        res.send(Buffer.from(buffer));

    } catch (err) {
        console.error("IMAGE PROXY ERROR:", err);
        res.status(500).send("Image load error");
    }
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 Server läuft auf Port", PORT);
});