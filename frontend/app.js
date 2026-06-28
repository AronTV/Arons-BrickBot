
async function loadProduct(id) {

    console.log("👉 LOAD:", id);

    const info = document.getElementById("info");
    info.innerHTML = "⏳ Lade...";

    const res = await fetch(`/api/search/${id}`);
    const json = await res.json();

    console.log("RAW:", json);

    const data = json.data || {};

    const imageUrl = data.image;

    info.innerHTML = `
        <div class="card">

            <h2>${data.name || id}</h2>

            <img src="/api/image?url=${encodeURIComponent(imageUrl || "")}" />

            <div class="price-box">
                <div><b>Preis</b><br>${data.price || "-"}</div>
                <div><b>Teile</b><br>${data.parts || "-"}</div>
                <div><b>EAN</b><br>${data.ean || "-"}</div>
            </div>

            <div class="info-grid">
                <div>Minifiguren: <b>${data.minifigures || "-"}</b></div>
                <div>Alter: <b>${data.age || "-"}</b></div>
                <div>Maße: <b>${data.dimensions || "-"}</b></div>
                <div>Gewicht: <b>${data.weight || "-"}</b></div>
                <div>Jahr: <b>${data.year || "-"}</b></div>
            </div>

            <div class="button-row">

                <a class="btn primary" target="_blank"
                   href="${data.setdb?.url}">
                   📚 Set ansehen
                </a>

                <a class="btn secondary" target="_blank"
                   href="${data.bluebrixx?.url}">
                   🛒 BlueBrixx
                </a>

            </div>

        </div>
    `;
}