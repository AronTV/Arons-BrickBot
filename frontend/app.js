async function loadProduct(id) {

    console.log("👉 loadProduct gestartet:", id);

    const info = document.getElementById("info");
    const title = document.getElementById("title");
    const image = document.getElementById("image");
    const priceSetdb = document.getElementById("price-setdb");
    const priceBluebrixx = document.getElementById("price-bluebrixx");
    const status = document.getElementById("status");
    const input = document.getElementById("articleInput");

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
        console.error("FETCH ERROR:", err);
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
       BASIC UI
    ========================= */

    title.innerText = data.name || "-";

    image.src = data.image
        ? `/api/image?url=${encodeURIComponent(data.image)}`
        : "";

    priceSetdb.innerText =
        data.setdb?.price ? `${data.setdb.price} €` : "-";

    priceBluebrixx.innerText =
        data.bluebrixx?.price ? `${data.bluebrixx.price} €` : "-";

    status.innerText =
        data.bluebrixx?.status || "-";

    /* =========================
       EXTRA INFO
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
       BUTTONS
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

    if (input) input.value = "";
}

/* =========================
   DARK MODE TOGGLE
========================= */

function toggleTheme() {
    const isLight = document.body.classList.toggle("light");

    localStorage.setItem("theme", isLight ? "light" : "dark");
}

/* =========================
   INIT THEME ON LOAD
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
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