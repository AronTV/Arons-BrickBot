
function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value ?? "-";
}

function setImg(id, src) {
    const el = document.getElementById(id);
    if (el) el.src = src || "";
}

/* =========================
   LOAD PRODUCT
========================= */

async function loadProduct(id) {

    console.log("👉 loadProduct:", id);

    const info = document.getElementById("info");

    let res, json;

    try {
        res = await fetch(`/api/search/${id}`);
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
       UI UPDATE
    ========================= */

    setText("title", data.name);

    setImg("image",
        data.image ? `/api/image?url=${encodeURIComponent(data.image)}` : ""
    );

    setText("price-setdb",
        data.setdb?.price ? data.setdb.price + " €" : "-"
    );

    setText("price-bluebrixx",
        data.bluebrixx?.price ? data.bluebrixx.price + " €" : "-"
    );

    setText("status",
        data.bluebrixx?.status || "-"
    );

    /* =========================
       EXTRA INFO GRID
    ========================= */

    info.innerHTML = `
        <div class="info-grid">

            <div>EAN: <b>${data.ean}</b></div>
            <div>Teile: <b>${data.parts}</b></div>
            <div>Minifiguren: <b>${data.minifigures}</b></div>
            <div>Alter: <b>${data.age}</b></div>
            <div>Maße: <b>${data.dimensions}</b></div>
            <div>Gewicht: <b>${data.weight}</b></div>
            <div>Jahr: <b>${data.year}</b></div>
            <div>Thema: <b>${data.theme}</b></div>
            <div>Bewertung: <b>${data.rating}</b></div>
            <div>Preis/Stein: <b>${data.pricePerPart}</b></div>

        </div>

        <div class="button-row">

            ${data.setdb?.url ? `
                <a class="btn primary" target="_blank" href="${data.setdb.url}">
                    📚 In SetDB öffnen
                </a>
            ` : ""}

            ${data.bluebrixx?.url ? `
                <a class="btn secondary" target="_blank" href="${data.bluebrixx.url}">
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
    const light = document.body.classList.toggle("light");
    localStorage.setItem("theme", light ? "light" : "dark");
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light");
    }

    document.getElementById("articleInput")
        ?.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                loadProduct(e.target.value);
            }
        });
});