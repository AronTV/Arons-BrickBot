const axios = require("axios");
const cheerio = require("cheerio");

async function fetchProduct(id) {

    const url = `https://www.merlinssteine.de/sets/bb-${id}/`;

    const res = await axios.get(url, {
        headers: {
            "User-Agent": "Mozilla/5.0"
        }
    });

    const $ = cheerio.load(res.data);

    const bodyText = $("body").text();

    const name = $("h1").first().text().trim() || `BB-${id}`;

    /* =========================
       HERSTELLER
    ========================= */
    let manufacturer = "-";
    const m = bodyText.match(/Von:\s*(.*?)\s*EAN/i);
    if (m?.[1]) manufacturer = m[1].trim();

    /* =========================
       PREIS (SIMPLE & STABLE)
    ========================= */
    let setdbPrice = null;

    const priceMatch = bodyText.match(/(\d{1,4}[.,]\d{2})\s?€/);

    if (priceMatch?.[1]) {
        setdbPrice = parseFloat(priceMatch[1].replace(",", "."));
    }

    /* =========================
       BLUEBRIXX (SIMPLE)
    ========================= */
    let bluebrixx = {
        price: null,
        url: null,
        status: "unknown"
    };

    const eu = bodyText.match(/EU:\s*(https?:\/\/[^\s]+)/i);

    if (eu?.[1]) {

        bluebrixx.url = eu[1];

        try {
            const bb = await axios.get(eu[1], {
                headers: {
                    "User-Agent": "Mozilla/5.0"
                }
            });

            const t = bb.data.toString();

            const bbPrice = t.match(/(\d{1,4}[.,]\d{2})\s?€/);

            if (bbPrice?.[1]) {
                bluebrixx.price = parseFloat(bbPrice[1].replace(",", "."));
            }

            if (t.includes("Sofort")) bluebrixx.status = "available";
            else if (t.includes("Bald")) bluebrixx.status = "soon";
            else if (t.includes("ausverkauft")) bluebrixx.status = "out";
        }
        catch {
            bluebrixx.status = "error";
        }
    }

    return {
        id,
        name,
        manufacturer,
        image: `https://cdn.merlinssteine.de/images/BB-${id}/main/BB-${id}-w480.webp`,

        setdb: {
            price: setdbPrice,
            url
        },

        bluebrixx
    };
}

module.exports = { fetchProduct };