async function loadProduct(id) {

    const res = await fetch(`/api/search/${id}`);
    const json = await res.json();

    if (!json.success) return;

    const data = json.data;

    document.getElementById("title").innerText = data.name;

    document.getElementById("image").src =
        `/api/image?url=${encodeURIComponent(data.image)}`;

    document.getElementById("price-setdb").innerText =
        data.setdb.price ? data.setdb.price + " €" : "-";

    document.getElementById("price-bluebrixx").innerText =
        data.bluebrixx.price ? data.bluebrixx.price + " €" : "-";

    document.getElementById("status").innerText =
        data.bluebrixx.status ?? "-";

    document.getElementById("info").innerHTML = `
        <div class="info-grid">

            <div>EAN: <b>${data.ean ?? "-"}</b></div>
            <div>Teile: <b>${data.parts ?? "-"}</b></div>
            <div>Minifiguren: <b>${data.minifigures ?? "-"}</b></div>
            <div>Alter: <b>${data.age ?? "-"}</b></div>
            <div>Maße: <b>${data.dimensions ?? "-"}</b></div>
            <div>Gewicht: <b>${data.weight ?? "-"}</b></div>
            <div>Jahr: <b>${data.year ?? "-"}</b></div>
            <div>Thema: <b>${data.theme ?? "-"}</b></div>
            <div>Bewertung: <b>${data.rating ?? "-"}</b></div>

            <div>Preis/Stein: <b>${data.pricePerPart ?? "-"}</b></div>

        </div>

        <div class="button-row">

            <a class="btn primary" href="${data.setdb?.url ?? '#'}" target="_blank">
                📚 In SetDB öffnen
            </a>

            <a class="btn secondary" href="${data.bluebrixx?.url ?? '#'}" target="_blank">
                🛒 Bei BlueBrixx öffnen
            </a>

        </div>
    `;
}