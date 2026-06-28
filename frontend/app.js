
function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
}

function setImg(id, src) {
    const el = document.getElementById(id);
    if (el) el.src = src;
}

/* =========================
   MAIN FUNCTION
========================= */

async function loadProduct(id) {

    console.log("👉 loadProduct gestartet:", id);

    const info = document.getElementById("info");

    let json;

    try {
        const res = await fetch(`/api/search/${id}`);
        json = await res.json();

        console.log("RAW RESPONSE:", json);

        if (!res.ok) {
            info.innerHTML = "❌ HTTP Fehler: " + res.status;
            return;
        }

    } catch (err) {
        console.error(err);
        info.innerHTML = "❌ Server nicht erreichbar";
        return;
    }

    if (!json?.success || !json?.data) {
        info.innerHTML = "❌ Keine gültigen Daten";
        return;
    }

    const data = json.data;

    console.log("DATA:", data);

    /* =========================
       BASIC UI SAFE
    ========================= */

    setText("title", data.name || "-");

    setImg(
        "image",
        data.image ? `/api/image?url=${encodeURIComponent(data.image)}` : ""
    );

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
       INFO GRID
    ========================= */

    const extraInfo = `
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
    `;

    /* =========================
       BUTTONS SAFE
    ========================= */

    const buttons = `
        <div class="button-row">

            ${data?.setdb?.url ? `
                <a class="btn primary" target="_blank" href="${data.setdb.url}">
                    📚 In SetDB öffnen
                </a>
            ` : ""}

            ${data?.bluebrixx?.url ? `
                <a class="btn secondary" target="_blank" href="${data.bluebrixx.url}">
                    🛒 Bei BlueBrixx öffnen
                </a>
            ` : ""}

        </div>
    `;

    /* =========================
       RENDER
    ========================= */

    info.innerHTML = extraInfo + buttons;
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