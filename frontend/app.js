async function loadProduct(id) {

    const res = await fetch(`/api/search/${id}`);
    const json = await res.json();

    console.log("FULL RESPONSE:", json);

    const info = document.getElementById("info");
    const title = document.getElementById("title");
    const image = document.getElementById("image");
    const priceSetdb = document.getElementById("price-setdb");
    const priceBluebrixx = document.getElementById("price-bluebrixx");
    const status = document.getElementById("status");
    const input = document.getElementById("articleInput");

    /* =========================
       HARD FAIL SAFE
    ========================= */

    if (!json || json.success !== true || !json.data) {
        info.innerHTML = "❌ Backend liefert keine gültigen Daten";
        return;
    }

    const data = json.data || {};

    /* =========================
       BASIC UI SAFE RENDER
    ========================= */

    title.innerText = data.name || "-";

    image.src = data.image
        ? `/api/image?url=${encodeURIComponent(data.image)}`
        : "";

    priceSetdb.innerText =
        data.setdb?.price != null ? `${data.setdb.price} €` : "-";

    priceBluebrixx.innerText =
        data.bluebrixx?.price != null ? `${data.bluebrixx.price} €` : "-";

    status.innerText =
        data.bluebrixx?.status || "-";

    /* =========================
       EXTRA INFO SAFE GRID
    ========================= */

    const extraInfo = `
    <div class="info-grid">

        <div>EAN: <b>${data.ean || "-"}</b></div>
        <div>Teileanzahl: <b>${data.parts || "-"}</b></div>
        <div>Minifiguren: <b>${data.minifigures || "-"}</b></div>
        <div>Altersempfehlung: <b>${data.age || "-"}</b></div>
        <div>Maße: <b>${data.dimensions || "-"}</b></div>
        <div>Gewicht: <b>${data.weight || "-"}</b></div>
        <div>Erscheinungsjahr: <b>${data.year || "-"}</b></div>
        <div>Themenwelt/Serie: <b>${data.theme || "-"}</b></div>
        <div>Bewertung: <b>${data.rating || "-"}</b></div>

        <div>Preis/Stein: <b>${data.pricePerPart || "-"}</b></div>

    </div>
    `;

    /* =========================
       SAFE BUTTONS (CRASH PROOF)
    ========================= */

    const setdbUrl = data?.setdb?.url || null;
    const blueUrl = data?.bluebrixx?.url || null;

    const buttons = `
    <div class="button-row">

        ${setdbUrl ? `
            <a class="btn primary" target="_blank" href="${setdbUrl}">
                📚 In SetDB öffnen
            </a>
        ` : `
            <span></span>
        `}

        ${blueUrl ? `
            <a class="btn secondary" target="_blank" href="${blueUrl}">
                🛒 Bei BlueBrixx öffnen
            </a>
        ` : `
            <span></span>
        `}

    </div>
    `;

    /* =========================
       FINAL RENDER (NO BREAKS POSSIBLE)
    ========================= */

    info.innerHTML = extraInfo + buttons;

    /* =========================
       INPUT RESET SAFE
    ========================= */

    if (input) input.value = "";
}

/* =========================
   ENTER KEY SUPPORT (STABLE)
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("articleInput");

    if (!input) return;

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            loadProduct(input.value);
        }
    });

});