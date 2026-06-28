const express = require("express");
const path = require("path");

const app = express();

/* =========================
   STATIC FRONTEND
========================= */

app.use(express.static(path.join(__dirname, "../frontend")));

/* =========================
   MOCK / SCRAPER (DEIN ECHTES SYSTEM HIER EINBAUEN)
========================= */

async function fetchProductData(id) {
    return {
        id,
        name: "BlueBrixx - Burg Blaustein | Set 108712",

        ean: "4060904020913",
        parts: 5327,
        minifigures: 7,
        age: "10+",
        dimensions: "406 x 398 x 295 mm",
        weight: "4 kg",
        year: 2024,
        theme: "BlueBrixx",
        rating: 4.7,

        pricePerPart: (199.95 / 5327).toFixed(3),

        image: "https://cdn.merlinssteine.de/images/BB-108712/main/BB-108712-w480.webp",

        setdb: {
            price: 199.95,
            url: "https://setdb.example.com/" + id
        },

        bluebrixx: {
            price: 199.95,
            status: "available",
            url: "https://www.bluebrixx.com/"
        }
    };
}

/* =========================
   API ROUTE
========================= */

app.get("/api/search/:id", async (req, res) => {
    try {
        const data = await fetchProductData(req.params.id);

        res.json({
            success: true,
            data
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: "server_error"
        });
    }
});

/* =========================
   IMAGE PROXY (FIX FÜR CORS / CDN BLOCKS)
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
    console.log("Server läuft auf Port", PORT);
});