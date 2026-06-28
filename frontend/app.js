async function loadProduct(id) {

    console.log("👉 loadProduct gestartet mit ID:", id);

    const info = document.getElementById("info");
    const title = document.getElementById("title");
    const image = document.getElementById("image");
    const priceSetdb = document.getElementById("price-setdb");
    const priceBluebrixx = document.getElementById("price-bluebrixx");
    const status = document.getElementById("status");
    const input = document.getElementById("articleInput");

    /* =========================
       FETCH
    ========================= */

    let res, json;

    try {
        res = await fetch(`/api/search/${id}`);
        json = await res.json();
    } catch (err) {
        console.error("FETCH ERROR:", err);
        info.innerHTML = "❌ Netzwerk-/Serverfehler";
        return;
    }

    console.log("👉 RESPONSE STATUS:", res.status);
    console.log("👉 RAW RESPONSE JSON:", json);

    /* =========================
       HARD CHECKS
    ========================= */

    if (!res.ok) {
        info.innerHTML = "❌ HTTP Fehler: " + res.status;
        return;
    }

    if (!json) {
        info.innerHTML = "❌ Kein JSON erhalten";
        return;
    }

    if (json.success !== true) {
        info.innerHTML = "❌ success = false";
        console.log("❌ Backend Fehlerobjekt:", json);
        return;
    }

    if (!json.data) {
        info.innerHTML = "❌ data ist leer oder null";
        console.log("❌ DATA FEHLT:", json);
        return;
    }

    const data = json.data;

    console.log("👉 DATA OK:", data);

    /* =========================
       BASIC UI
    ========================= */

    title.innerText = data.name || "NO NAME";

    image.src = data.image
        ? `/api/image?url=${encodeURIComponent(data.image)}`
        : "";

    priceSetdb.innerText =
        data?.setdb?.price != null ? `${data.setdb.price} €` : "-";

    priceBluebrixx.innerText =
        data?.bluebrixx?.price != null ? `${data.bluebrixx.price} €` : "-";

    status.innerText =
        data?.bluebrixx?.status || "-";

    /* =========================
       EXTRA INFO
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
       BUTTONS
    ========================= */

    const setdbUrl = data?.setdb?.url;
    const blueUrl = data?.bluebrixx?.url;

    const buttons = `
    <div class="button-row">

        ${setdbUrl ? `
            <a class="btn primary" target="_blank" href="${setdbUrl}">
                📚 In SetDB öffnen
            </a>
        ` : `<span style="color:#999">kein SetDB Link</span>`}

        ${blueUrl ? `
            <a class="btn secondary" target="_blank" href="${blueUrl}">
                🛒 Bei BlueBrixx öffnen
            </a>
        ` : `<span style="color:#999">kein BlueBrixx Link</span>`}

    </div>
    `;

    /* =========================
       FINAL RENDER
    ========================= */

    info.innerHTML = `
        <div style="background:#fff;padding:10px;border-radius:8px;">
            <b>DEBUG OUTPUT:</b><br><br>
            ${extraInfo}
            <hr>
            ${buttons}
            <hr>
            <pre>${JSON.stringify(data, null, 2)}</pre>
        </div>
    `;

    /* =========================
       RESET INPUT
    ========================= */

    if (input) input.value = "";
}

/* =========================
   ENTER SUPPORT
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("articleInput");

    if (!input) {
        console.warn("articleInput fehlt im HTML");
        return;
    }

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            loadProduct(input.value);
        }
    });
});