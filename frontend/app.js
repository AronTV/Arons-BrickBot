
async function loadProduct(id) {

    console.log("👉 loadProduct:", id);

    const info = document.getElementById("info");

    if (!info) {
        console.error("❌ #info fehlt");
        return;
    }

    info.innerHTML = "⏳ Lade...";

    let json;

    try {
        const res = await fetch(`/api/search/${id}`);
        json = await res.json();

        console.log("RAW RESPONSE:", json);

        if (!json?.success) {
            info.innerHTML = "❌ Keine Daten";
            return;
        }

    } catch (err) {
        console.error(err);
        info.innerHTML = "❌ Server Error";
        return;
    }

    const data = json.data || {};

    console.log("DATA:", data);

    /* =========================
       SAFE RENDER (NO DOM DEPENDENCIES)
    ========================= */

    info.innerHTML = `
        <div class="card">

            <h2>${data.name || `Set ${id}`}</h2>

            <img
                src="/api/image?url=${encodeURIComponent(data.image || "")}"
                style="max-width:100%; border-radius:12px;"
            />

            <div class="price-box">

                <div>
                    <b>SetDB</b><br>
                    ${data.setdb?.price ? data.setdb.price + " €" : "-"}
                </div>

                <div>
                    <b>BlueBrixx</b><br>
                    ${data.bluebrixx?.price ? data.bluebrixx.price + " €" : "-"}
                </div>

                <div>
                    <b>Status</b><br>
                    ${data.bluebrixx?.status || "-"}
                </div>

            </div>

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