const express = require("express");
const path = require("path");

const app = express();

/* =========================
   STATIC FRONTEND
========================= */

app.use(express.static(path.join(__dirname, "../frontend")));

/* =========================
   MOCK / SCRAPER PLACEHOLDER
   (HIER kommt dein echter Scraper rein)
========================= */

async function fetchProductData(id) {

    // 👉 Beispielstruktur (ersetze durch echten Scraper)
    return {
        name: "BlueBrixx - Burg Blaustein | Set 108712",

        ean: "4060904020913",
        parts: 5327,
        minifigures: 7,
        age: "10+",
        dimensions: "406 x 398 x 295 mm",
        weight: "4 kg",
        year: 2024,
        theme: "BlueBrixx Pro",
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
            url: "https://www.bluebrixx.com/..."
        }
    };
}

/* =========================
   API ROUTE
========================= */

app.get("/api/search/:id", async (req, res) => {

    try {
        const raw = await fetchProductData(req.params.id);

        /* =========================
           NORMALIZER (WICHTIG!)
        ========================= */

        const data = {
            name: raw.name || "-",

            ean: raw.ean || "-",
            parts: raw.parts || "-",
            minifigures: raw.minifigures || "-",
            age: raw.age || "-",
            dimensions: raw.dimensions || "-",
            weight: raw.weight || "-",
            year: raw.year || "-",
            theme: raw.theme || "-",
            rating: raw.rating || "-",

            pricePerPart: raw.pricePerPart || "-",

            image: raw.image || null,

            setdb: raw.setdb || {},
            bluebrixx: raw.bluebrixx || {}
        };

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
   START SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server läuft auf Port", PORT);
});