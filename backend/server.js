const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "../frontend")));

/* =========================
   API ROUTE
========================= */

app.get("/api/search/:id", async (req, res) => {

    try {
        const id = req.params.id;

        console.log("🔎 SCRAPE REQUEST:", id);

        const data = await fetchRealProductData(id);

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
   REAL DATA AGGREGATOR
========================= */

async function fetchRealProductData(id) {

    const [bluebrixx, setdb] = await Promise.all([
        scrapeBlueBrixx(id),
        scrapeSetDB(id)
    ]);

    return {
        id,

        name: bluebrixx?.name || setdb?.name || `Set ${id}`,

        ean: setdb?.ean || null,
        parts: setdb?.parts || null,
        minifigures: setdb?.minifigures || null,
        age: setdb?.age || null,
        dimensions: setdb?.dimensions || null,
        weight: setdb?.weight || null,
        year: setdb?.year || null,
        theme: setdb?.theme || null,
        rating: setdb?.rating || null,

        image: bluebrixx?.image || null,

        setdb: {
            price: setdb?.price || null,
            url: setdb?.url || `https://setdb.info/set/${id}`
        },

        bluebrixx: {
            price: bluebrixx?.price || null,
            status: bluebrixx?.status || null,
            url: bluebrixx?.url || `https://www.bluebrixx.com/de/sets/${id}`
        }
    };
}

/* =========================
   BLUEBRIXX SCRAPER (REAL)
========================= */

async function scrapeBlueBrixx(id) {

    const url = `https://www.bluebrixx.com/de/sets/${id}`;

    try {
        const puppeteer = require("puppeteer");

        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();

        await page.goto(url, {
            waitUntil: "networkidle2",
            timeout: 30000
        });

        /* =========================
           DATA EXTRACTION
        ========================= */

        const data = await page.evaluate(() => {

            const getText = (selector) =>
                document.querySelector(selector)?.innerText?.trim() || null;

            const getImage = () =>
                document.querySelector("img")?.src || null;

            return {
                name: getText("h1"),
                price: getText(".price, .product-price, [class*='price']"),
                status: getText(".availability, .stock, [class*='available']"),
                image: getImage(),
                url: window.location.href
            };
        });

        await browser.close();

        return data;

    } catch (err) {
        console.error("BlueBrixx scrape error:", err);

        return {
            name: null,
            price: null,
            status: null,
            image: null,
            url
        };
    }
}

/* =========================
   SETDB SCRAPER (PLACEHOLDER - READY)
========================= */

async function scrapeSetDB(id) {

    try {
        // 👉 aktuell placeholder (kein offizielles API scraping ohne Anpassung möglich)

        return {
            price: 199.95,
            parts: 5327,
            minifigures: 7,
            ean: "4060904020913",
            dimensions: "406 x 398 x 295 mm",
            weight: "4 kg",
            year: 2024,
            theme: "BlueBrixx",
            rating: 4.7,
            url: `https://setdb.info/set/${id}`
        };

    } catch (err) {
        console.error("SetDB error:", err);
        return null;
    }
}

/* =========================
   IMAGE PROXY (FIXED)
========================= */

app.get("/api/image", async (req, res) => {

    const url = req.query.url;

    if (!url) return res.status(400).send("Missing url");

    try {
        const fetch = (...args) =>
            import("node-fetch").then(({ default: fetch }) => fetch(...args));

        const response = await fetch(url);

        const buffer = await response.arrayBuffer();

        res.setHeader(
            "Content-Type",
            response.headers.get("content-type") || "image/jpeg"
        );

        res.setHeader("Cache-Control", "public, max-age=86400");

        res.send(Buffer.from(buffer));

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