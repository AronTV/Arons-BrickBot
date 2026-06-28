
/* =========================
   ENTER + INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("input");
    const button = document.getElementById("searchBtn");

    if (input) {
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();

                const value = input.value.trim();
                if (!value) return;

                console.log("⌨️ ENTER SEARCH:", value);

                loadProduct(value);
            }
        });
    }

    if (button && input) {
        button.addEventListener("click", () => {
            const value = input.value.trim();
            if (!value) return;

            loadProduct(value);
        });
    }
});

/* =========================
   MAIN FUNCTION
========================= */

async function loadProduct(id) {

    console.log("👉 LOAD PRODUCT:", id);

    const info = document.getElementById("info");

    if (!info) {
        console.error("❌ #info fehlt");
        return;
    }

    info.innerHTML = "⏳ Lade Produkt...";

    let json;

    try {
        const res = await fetch(`/api/search/${id}`);
        json = await res.json();

        console.log("🔴 RAW RESPONSE:", json);

        if (!json?.success) {
            info.innerHTML = "❌ Keine Daten erhalten";
            return;
        }

    } catch (err) {
        console.error("❌ FETCH ERROR:", err);
        info.innerHTML = "❌ Server nicht erreichbar";
        return;
    }

    const data = json?.data || {};

    console.log("🟡 DATA:", data);

    /* =========================
       IMAGE SAFE FIX
    ========================= */

    const imageUrl =
        data?.image && data.image.trim() !== ""
            ? data.image
            : null;

    const imageHTML = imageUrl
        ? `<img src="/api/image?url=${encodeURIComponent(imageUrl)}" />`
        : "";

    /* =========================
       RENDER UI
    ========================= */

    info.innerHTML = `
        <div class="card">

            <h2>${data.name || `Set ${id}`}</h2>

            ${imageHTML}

            <div class="price-box">

                <div>
                    <b>Preis</b><br>
                    ${data.price || "-"}
                </div>

                <div>
                    <b>Teile</b><br>
                    ${data.parts || "-"}
                </div>

                <div>
                    <b>EAN</b><br>
                    ${data.ean || "-"}
                </div>

            </div>

            <div class="info-grid">

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

        </div>
    `;
}