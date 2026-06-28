
function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value ?? "-";
}

function setImg(id, src) {
    const el = document.getElementById(id);
    if (el) el.src = src || "";
}

/* =========================
   URL CLEANER (WICHTIG FIX)
========================= */

function safeUrl(url) {

    if (!url) return null;

    try {
        const parsed = new URL(url);
        return parsed.href;
    } catch (e) {
        console.warn("❌ Invalid URL blocked:", url);
        return null;
    }
}

/* =========================
   LOAD PRODUCT
========================= */

async function loadProduct(id) {

    console.log("👉 loadProduct:", id);

    const info = document.getElementById("info");

    let json;

    try {
        const res = await fetch(`/api/search/${id}`);
        json = await res.json();

        console.log("RAW RESPONSE:", json);

    } catch (err) {
        console.error(err);
        info.innerHTML = "❌ Server Fehler";
        return;
    }

    if (!json?.success) {
        info.innerHTML = "❌ Keine Daten";
        return;
    }

    const data = json.data;

    console.log("DATA:", data);

    /* =========================
       BASIC UI
    ========================= */

    setText("title", data.name);
    setImg("image", data.image || "");

    setText("price-setdb",
        data.setdb?.price ? `${data.setdb.price} €` : "-"
    );

    setText("price-bluebrixx",
        data.bluebrixx?.price ? `${data.bluebrixx.price} €` : "-"
    );

    setText("status",
        data.bluebrixx?.status || "-"
    );

    /* =========================
       SAFE URLS (FIX CORE)
    ========================= */

    const setdbUrl = safeUrl(data.setdb?.url);
    const blueUrl = safeUrl(data.bluebrixx?.url);

    console.log("SETDB URL:", setdbUrl);
    console.log("BLUE URL:", blueUrl);

    /* =========================
       INFO GRID
    ========================= */

    info.innerHTML = `
        <div class="info-grid">

            <div>EAN: <b>${data.ean || "-"}</b></div>
            <div>Teile: <b>${data.parts || "-"}</b></div>
            <div>Minifiguren: <b>${data.minifigures || "-"}</b></div>
            <div>Alter: <b>${data.age || "-"}</b></div>
            <div>Maße: <b>${data.dimensions || "-"}</b></div>
            <div>Gewicht: <b>${data.weight || "-"}</b></div>
            <div>Jahr: <b>${data.year || "-"}</b></div>
            <div>Thema: <b>${data.theme || "-"}</b></div>
            <div>Bewertung: <b>${data.rating || "-"}</b></div>
            <div>Preis/Stein: <b>${data.pricePerPart || "-"}</b></div>

        </div>

        <div class="button-row">

            ${setdbUrl ? `
                <a class="btn primary" target="_blank" href="${setdbUrl}">
                    📚 In SetDB öffnen
                </a>
            ` : ""}

            ${blueUrl ? `
                <a class="btn secondary" target="_blank" href="${blueUrl}">
                    🛒 Bei BlueBrixx öffnen
                </a>
            ` : ""}

        </div>
    `;
}

/* =========================
   DARK MODE
========================= */

function toggleTheme() {
    const isLight = document.body.classList.toggle("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light");
    }

    const input = document.getElementById("articleInput");

    if (input) {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                loadProduct(input.value);
            }
        });
    }
});