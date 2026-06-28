
function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value ?? "-";
}

function setImg(id, src) {
    const el = document.getElementById(id);
    if (!el) return;
    el.src = src || "";
}

/* =========================
   MAIN LOAD FUNCTION
========================= */

async function loadProduct(id) {

    console.log("👉 LOAD PRODUCT:", id);

    const info = document.getElementById("info");

    if (!info) {
        console.error("❌ #info fehlt im HTML");
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

    console.log("🟡 DATA OBJECT:", data);
    console.log("🟢 IMAGE FIELD:", data?.image);

    /* =========================
       TITLE
    ========================= */

    setText("title", data.name || `Set ${id}`);

    /* =========================
       IMAGE (100% SAFE FIX)
    ========================= */

    const imageUrl = (data?.image && data.image.trim() !== "")
        ? data.image
        : null;

    console.log("🧪 FINAL IMAGE URL:", imageUrl);

    if (imageUrl) {
        setImg(
            "image",
            `/api/image?url=${encodeURIComponent(imageUrl)}`
        );
    } else {
        console.warn("⚠️ Kein Bild vorhanden für:", id);
        setImg("image", "");
    }

    /* =========================
       PRICES
    ========================= */

    setText(
        "price-setdb",
        data.setdb?.price ? `${data.setdb.price} €` : "-"
    );

    setText(
        "price-bluebrixx",
        data.bluebrixx?.price ? `${data.bluebrixx.price} €` : "-"
    );

    setText(
        "status",
        data.bluebrixx?.status || "-"
    );

    /* =========================
       INFO GRID
    ========================= */

    info.innerHTML = `
        <div class="card">

            <h2>${data.name || `Set ${id}`}</h2>

            <img
                src="${imageUrl ? `/api/image?url=${encodeURIComponent(imageUrl)}` : ""}"
                style="width:100%; max-width:420px; border-radius:16px; margin-top:15px;"
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