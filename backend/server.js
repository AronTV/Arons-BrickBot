const express = require("express");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

app.use(express.static(path.join(__dirname, "../frontend")));

/* =========================
   MAIN API
========================= */

app.get("/api/search/:id", async (req, res) => {

    try {
        const id = req.params.id;

        console.log("🔎 REQUEST ID:", id);

        const data = await scrapeMerlinsSteine(id);

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
   MERLINSSTEINE SCRAPER
========================= */

async function scrapeMerlinsSteine(id) {

    const url = `https://www.merlinssteine.de/sets/bb-${id}/`;

    try {
        const { data: html } = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const $ = cheerio.load(html);

        const text = $("body").text();

        return {
            id,
            name: $("h1").first().text().trim() || `Set ${id}`,

            price: extractPrice(text),
            parts: extractAfter(text, "Teileanzahl"),
            ean: extractAfter(text, "EAN"),
            minifigures: extractAfter(text, "Minifiguren"),
            age: extractAfter(text, "Alter"),
            dimensions: extractAfter(text, "Maße"),
            weight: extractAfter(text, "Gewicht"),
            year: extractAfter(text, "Erscheinungsjahr"),
            theme: "BlueBrixx",

            rating: null,

            image: `https://cdn.merlinssteine.de/images/BB-${id}/main/BB-${id}-w480.webp`,

            setdb: {
                price: null,
                url: `https://www.merlinssteine.de/sets/bb-${id}/`
            },

            bluebrixx: {
                price: null,
                status: "available",
                url: `https://www.bluebrixx.com/de/sets/${id}`
            }
        };

    } catch (err) {
        console.error("SCRAPER ERROR:", err);

        return {
            id,
            name: `Set ${id}`,
            image: null
        };
    }
}

/* =========================
   HELPERS
========================= */

function extractPrice(text) {
    const match = text.match(/(\d{2,3},\d{2})\s?€/);
    return match ? parseFloat(match[1].replace(",", ".")) : null;
}

function extractAfter(text, label) {
    const regex = new RegExp(label + "\\s*:?\\s*(\\d+|[0-9., x×-]+)", "i");
    const match = text.match(regex);
    return match ? match[1].trim() : null;
}

/* =========================
   IMAGE PROXY
========================= */

app.get("/api/image", async (req, res) => {

    const url = req.query.url;

    if (!url || url.trim() === "") {
        return res.status(400).send("Missing image url");
    }

    try {
        const response = await axios.get(url, {
            responseType: "arraybuffer"
        });

        res.setHeader(
            "Content-Type",
            response.headers["content-type"] || "image/jpeg"
        );

        res.setHeader("Cache-Control", "public, max-age=86400");

        res.send(Buffer.from(response.data));

    } catch (err) {
        console.error("IMAGE ERROR:", err);
        res.status(500).send("image error");
    }
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 BrickBot running on port", PORT);
});