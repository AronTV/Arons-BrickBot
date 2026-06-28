document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("input");
    const btn = document.getElementById("btn");
    const result = document.getElementById("result");

    // -------------------------
    // FORMAT HELPER
    // -------------------------
    function formatPrice(value) {
        if (value === null || value === undefined) return "-";
        return `${Number(value).toFixed(2)} €`;
    }

    function getStatusClass(status) {
        switch (status) {
            case "available": return "🟢 Verfügbar";
            case "soon": return "🟡 Bald verfügbar";
            case "out": return "🔴 Ausverkauft";
            default: return "⚪ Unbekannt";
        }
    }

    // -------------------------
    // LOADING STATE
    // -------------------------
    function showLoading() {
        result.innerHTML = `
            <div class="card">
                <div style="height:240px;background:#222;animation:pulse 1.2s infinite;"></div>
                <div class="content">
                    <div class="title">Lade Produkt…</div>
                    <div class="meta">Bitte warten</div>
                </div>
            </div>

            <style>
            @keyframes pulse {
                0% { opacity: 0.4; }
                50% { opacity: 0.7; }
                100% { opacity: 0.4; }
            }
            </style>
        `;
    }

    // -------------------------
    // MAIN SEARCH
    // -------------------------
    async function search() {

        const id = input.value.trim();
        if (!id) return;

        showLoading();

        try {
            const res = await fetch(`/api/search/${id}`);
            const data = await res.json();

            if (!data.success) {
                result.innerHTML = `
                    <div class="card">
                        <div class="content">
                            <div class="title">Fehler</div>
                            <div class="meta">${data.error || "Unbekannter Fehler"}</div>
                        </div>
                    </div>
                `;
                return;
            }

            const p = data.data;

            result.innerHTML = `
                <div class="card">

                    <img src="/api/image?url=${encodeURIComponent(p.image)}">

                    <div class="content">

                        <div class="title">${p.name || "Unbekannt"}</div>
                        <div class="meta">
                            Hersteller: ${p.manufacturer || "-"}<br>
                            Artikelnummer: ${p.id}
                        </div>

                        <div class="price-row">
                            <div>
                                <div class="price-label">SetDB</div>
                                <div class="price-value">${formatPrice(p.setdb?.price)}</div>
                            </div>

                            <div>
                                <div class="price-label">BlueBrixx</div>
                                <div class="price-value">${formatPrice(p.bluebrixx?.price)}</div>
                            </div>
                        </div>

                        <div class="status" style="
                            margin-top:12px;
                            background: ${
                                p.bluebrixx?.status === "available" ? "rgba(0,255,100,0.15)" :
                                p.bluebrixx?.status === "soon" ? "rgba(255,200,0,0.15)" :
                                p.bluebrixx?.status === "out" ? "rgba(255,0,0,0.15)" :
                                "rgba(255,255,255,0.05)"
                            };
                            color: ${
                                p.bluebrixx?.status === "available" ? "#3cff88" :
                                p.bluebrixx?.status === "soon" ? "#ffd24d" :
                                p.bluebrixx?.status === "out" ? "#ff5c5c" :
                                "#9aa3b2"
                            };
                            padding:6px 10px;
                            border-radius:8px;
                            display:inline-block;
                        ">
                            ${getStatusClass(p.bluebrixx?.status)}
                        </div>

                    </div>
                </div>
            `;

        } catch (err) {
            result.innerHTML = `
                <div class="card">
                    <div class="content">
                        <div class="title">Netzwerkfehler</div>
                        <div class="meta">${err.message}</div>
                    </div>
                </div>
            `;
        }
    }

    // -------------------------
    // EVENTS
    // -------------------------
    btn.addEventListener("click", search);

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") search();
    });

});