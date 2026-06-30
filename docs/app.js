/* SOURCE Product Data Platform — renderer & animations */
(function () {
  const D = window.SOURCE_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  const euro = n => n == null ? "—" : "€" + Number(n).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  /* ---- icon set (clean line SVGs, no emoji) ---- */
  const I = {
    pen:    'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z',
    bag:    'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0',
    bottle: 'M10 2h4M10 2v2.5L9 7v13a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V7l-1-2.5V2M9 12h6',
    shirt:  'M20.4 3.5 16 2a4 4 0 0 1-8 0L3.6 3.5a2 2 0 0 0-1.3 2.2l.5 3.5a1 1 0 0 0 1 .8H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.2a1 1 0 0 0 1-.8l.5-3.5a2 2 0 0 0-1.3-2.2z',
    plug:   'M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0zM12 17v5',
    gift:   'M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
    box:    'M21 8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.3 7 12 12l8.7-5M12 22V12',
    car:    'M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM23 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM5 17h14M3 17v-5l3-5h9l4 5v5M3 12h17',
    download:'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
    shuffle:'M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5',
    shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
    db:     'M12 8c4.4 0 8-1.3 8-3s-3.6-3-8-3-8 1.3-8 3 3.6 3 8 3zM4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
    clock:  'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2'
  };
  const svg = (d, cls) => `<svg class="${cls||''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d.split('|').map(p=>`<path d="${p}"/>`).join('')}</svg>`;

  const CAT = {
    "Büro & Schreibgeräte":  { fg: "#003D7A", bg: "#eef3fb", ic: I.pen },
    "Taschen & Gepäck":      { fg: "#6d28d9", bg: "#f1ecfd", ic: I.bag },
    "Küche & Zuhause":       { fg: "#0e7490", bg: "#e6f6fa", ic: I.bottle },
    "Bekleidung":            { fg: "#be185d", bg: "#fce7f1", ic: I.shirt },
    "Elektronik & Mechanik": { fg: "#334155", bg: "#eef1f5", ic: I.plug },
    "Streuartikel":          { fg: "#d97f00", bg: "#fff4e3", ic: I.gift },
    "Auto & Reisen":         { fg: "#0d7d6b", bg: "#e4f6f2", ic: I.car },
    "Uncategorized":         { fg: "#64748b", bg: "#eef1f5", ic: I.box }
  };
  const catOf = c => CAT[c] || CAT["Uncategorized"];
  const DONUT = ["#003D7A", "#F39200", "#0e7490", "#be185d", "#6d28d9", "#2e9e5b", "#64748b"];

  const COLOR_HEX = { blau: "#2f6fd0", schwarz: "#1f2937", rot: "#dc2626", weiss: "#f3f4f6", "weiß": "#f3f4f6",
    grün: "#16a34a", gruen: "#16a34a", silber: "#cbd5e1", anthrazit: "#374151", navy: "#1e3a8a", grau: "#9ca3af",
    natur: "#e7d5b0", beige: "#e7d5b0", braun: "#92633b", gelb: "#eab308", transparent: "#dbeafe", bunt: "#a855f7",
    petrol: "#0e7490", khaki: "#a3a16b", rosa: "#f9a8d4", multicolour: "#a855f7" };
  const colHex = c => COLOR_HEX[(c || "").toLowerCase()] || "#cbd5e1";

  const ISSUE = { missing_required: "Pflichtfeld fehlt", missing_price: "Keine Preisstaffel", invalid_price: "Ungültiger Preis (≤ 0)",
    single_price_scale: "Nur eine Preisstaffel", invalid_stock: "Negativer Bestand", missing_gtin: "EAN/GTIN fehlt",
    invalid_gtin: "Ungültige EAN-13", missing_image: "Produktbild fehlt", invalid_image: "Ungültige Bild-URL",
    missing_print_method: "Keine Veredelungsart", unmapped_category: "Kategorie nicht zugeordnet",
    short_description: "Beschreibung zu kurz", no_colors: "Keine Farbvarianten", duplicate_sku: "Doppelte SKU" };
  const ERR = new Set(["missing_required", "missing_price", "invalid_price", "invalid_stock", "duplicate_sku"]);
  const scoreCol = s => s >= 80 ? "#2e9e5b" : s >= 60 ? "#F39200" : "#e0492f";
  const scoreBar = s => s >= 80 ? "linear-gradient(90deg,#2e9e5b,#5cc385)" : s >= 60 ? "linear-gradient(90deg,#F39200,#ffba5a)" : "linear-gradient(90deg,#e0492f,#f0775f)";

  function countUp(node, target, dur = 1300, dec = 0) {
    const start = performance.now();
    (function step(now) {
      const p = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - p, 3);
      node.textContent = (target * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(step); else node.textContent = target.toFixed(dec);
    })(performance.now());
  }

  /* ---- hero ---- */
  $("#hero-run").textContent = D.run_id;
  $("#nav-run").textContent = D.run_id.replace("run_", "");
  const k = D.kpis;
  [["suppliers", "Lieferanten-Feeds", 0], ["incoming", "Datensätze eingelesen", 0],
   ["published", "In Single Source of Truth", 0], ["avg_score", "Ø Qualitäts-Score", 0]].forEach(([key, lab, dec]) => {
    const c = el("div", "hk"); c.innerHTML = `<div class="n cntH" data-n="${k[key]}" data-d="${dec}">0</div><div class="l">${lab}</div>`;
    $("#hero-kpis").appendChild(c);
  });
  setTimeout(() => document.querySelectorAll(".cntH").forEach(n => countUp(n, +n.dataset.n, 1400, +n.dataset.d)), 220);

  /* ---- suppliers ---- */
  D.suppliers.forEach((s, idx) => {
    const sm = s.summary, col = scoreCol(sm.score);
    const c = el("div", "sup"); c.style.setProperty("--barcol", scoreBar(sm.score));
    c.innerHTML = `
      <div class="sup-top"><div class="sup-name">${s.name}</div><div class="sup-fmt">${s.format}</div></div>
      <div class="sup-score" style="color:${col}"><span class="v cnt" data-n="${sm.score}" data-d="1">0</span><small>/100</small></div>
      <div class="sup-track"><i data-w="${sm.score}"></i></div>
      <div class="sup-stats"><span class="dotc">● <b>${sm.rows_clean}</b> sauber</span>
        <span class="dote">● <b>${sm.error_count}</b> Fehler</span>
        <span class="dotw">● <b>${sm.warning_count}</b> Warnungen</span></div>
      <div class="sup-cta">Lieferanten-Report ${svg('M5 12h14|M13 6l6 6-6 6')}</div>`;
    c.addEventListener("click", () => openModal(idx));
    $("#sup-grid").appendChild(c);
  });

  /* ---- pipeline ---- */
  [["Ingest", I.download, "BMEcat-, Promidata-, CSV- & Excel-Adapter lesen jeden Lieferanten-Feed.", "Cloud Storage + Functions"],
   ["Normalize", I.shuffle, "Ein Produktmodell: Währung→EUR, Einheiten→kg, Lieferantenkategorien → SOURCE-Taxonomie.", "Dataform (staging)"],
   ["Quality", I.shield, "Jeder Feed wird bewertet; Fehler & Warnungen werden an Lieferanten zurückgemeldet.", "Dataform assertions"],
   ["Source of Truth", I.db, "Nur fehlerfreie Artikel werden in den geprüften Katalog übernommen.", "BigQuery mart"],
   ["Version", I.clock, "Unveränderliche Snapshots + Diff je Lauf — jeder Stand ist reproduzierbar.", "BigQuery snapshots"]
  ].forEach(([h, ic, p, g], i, arr) => {
    const st = el("div", "stage reveal"); st.style.transitionDelay = (i * 70) + "ms";
    st.innerHTML = `<div class="ic">${svg(ic)}</div><h4>${h}</h4><p>${p}</p><span class="gcp">${g}</span>` +
      (i < arr.length - 1 ? `<span class="arr">${svg('M5 12h14|M13 6l6 6-6 6')}</span>` : "");
    $("#flow").appendChild(st);
  });

  /* ---- catalog ---- */
  $("#cat-count").textContent = D.catalog.length + " Produkte";
  let activeCat = "Alle", q = "";
  const chips = $("#chips");
  ["Alle", ...Object.keys(D.category_breakdown)].forEach(cat => {
    const ch = el("div", "chip" + (cat === "Alle" ? " active" : ""), cat);
    ch.addEventListener("click", () => { activeCat = cat; chips.querySelectorAll(".chip").forEach(x => x.classList.toggle("active", x === ch)); draw(); });
    chips.appendChild(ch);
  });
  $("#search").addEventListener("input", e => { q = e.target.value.toLowerCase().trim(); draw(); });

  function card(p, i) {
    const c = catOf(p.category);
    const dots = (p.colors || []).slice(0, 5).map(col => `<i title="${col}" style="background:${colHex(col)}"></i>`).join("");
    const tags = (p.print_methods || []).slice(0, 2).map(t => `<span class="tg">${t}</span>`).join("");
    const d = el("div", "prod"); d.style.animationDelay = Math.min(i * 30, 450) + "ms";
    d.innerHTML = `
      <div class="ph" style="background:${c.bg};color:${c.fg}">${svg(c.ic)}<img class="ph-img" loading="lazy" alt="${p.name}" src="img/${p.sku}.jpg" onerror="this.remove()">${p.eco ? '<span class="eco">ECO</span>' : ""}</div>
      <div class="body">
        <div class="cat">${p.category || "Uncategorized"}</div>
        <div class="nm">${p.name}</div>
        <div class="brand">${p.manufacturer || p._supplier_name}</div>
        <div class="meta"><div class="price"><small>ab</small><b>${euro(p.price_from_eur)}</b></div><div class="dots">${dots}</div></div>
        <div class="tags">${tags}</div>
      </div>`;
    return d;
  }
  function draw() {
    const g = $("#cat-grid"); g.innerHTML = "";
    const list = D.catalog.filter(p => {
      if (activeCat !== "Alle" && (p.category || "Uncategorized") !== activeCat) return false;
      if (!q) return true;
      return (p.name + " " + (p.manufacturer || "") + " " + p._supplier_name + " " + (p.material || "") + " " + (p.colors || []).join(" ")).toLowerCase().includes(q);
    });
    if (!list.length) { g.appendChild(el("div", "empty", "Keine Produkte gefunden.")); return; }
    list.forEach((p, i) => g.appendChild(card(p, i)));
  }
  draw();

  /* ---- donut ---- */
  (function () {
    const s = $("#donut"), entries = Object.entries(D.category_breakdown);
    const total = entries.reduce((a, [, n]) => a + n, 0), R = 80, C = 2 * Math.PI * R; let acc = 0;
    $("#donut-total").dataset.n = total;
    entries.forEach(([cat, n], i) => {
      const len = n / total * C, color = DONUT[i % DONUT.length];
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx", 100); c.setAttribute("cy", 100); c.setAttribute("r", R);
      c.setAttribute("fill", "none"); c.setAttribute("stroke", color); c.setAttribute("stroke-width", 24);
      c.setAttribute("stroke-dasharray", `${len} ${C}`); c.setAttribute("stroke-dashoffset", len);
      c.setAttribute("transform", `rotate(${-90 + acc / C * 360} 100 100)`);
      s.appendChild(c); requestAnimationFrame(() => requestAnimationFrame(() => c.setAttribute("stroke-dashoffset", 0)));
      acc += len;
      $("#legend").appendChild(el("div", "li", `<i style="background:${color}"></i>${cat}<span>${n}</span>`));
    });
  })();

  /* ---- issue bars ---- */
  (function () {
    const entries = Object.entries(D.issue_totals), max = Math.max(...entries.map(([, n]) => n), 1);
    entries.forEach(([code, n]) => {
      const row = el("div", "ib " + (ERR.has(code) ? "e" : "w"));
      row.innerHTML = `<span>${ISSUE[code] || code}</span><div class="track"><i data-w="${n / max * 100}"></i></div><span class="n">${n}</span>`;
      $("#issues").appendChild(row);
    });
  })();

  /* ---- footer ---- */
  $("#foot-meta").innerHTML = `<div>Generiert <b>${D.generated_at}</b></div><div>Lauf <b>${D.run_id}</b></div>
    ${D.engine ? `<div>Engine: <b>${D.engine}</b></div>` : ""}
    <div>Source of Truth: <b>${D.diff.total}</b> Produkte · +${D.diff.added} / ~${D.diff.changed} / -${D.diff.removed}</div>`;
  if (D.engine) { const p = $("#nav-run"); if (p) p.textContent = "BigQuery"; }

  /* ---- modal ---- */
  function openModal(idx) {
    const s = D.suppliers[idx], sm = s.summary;
    const fixes = Object.entries(sm.code_tally).map(([code, n]) => {
      const sev = ERR.has(code) ? "error" : "warning";
      return `<div class="fix ${sev}"><span class="c" style="color:${sev === "error" ? "var(--bad)" : "var(--warn)"}">${n}</span>
        <span class="l">${ISSUE[code] || code}</span><span class="code">${code}</span></div>`;
    }).join("") || `<div class="fix clean"><span class="c" style="color:var(--ok)">✓</span><span class="l">Keine Probleme — Feed ist sauber</span></div>`;
    const rows = s.products.map(p => {
      const bd = (p._issues || []).map(i => `<span class="bp ${i.severity === "error" ? "e" : "w"}">${ISSUE[i.code] || i.message}</span>`).join("") || '<span class="bok">OK</span>';
      return `<tr><td><b>${p.supplier_sku || "—"}</b></td><td>${p.name || "—"}</td><td>${euro(p.price_from_eur)}</td>
        <td>${p.stock_qty != null ? p.stock_qty.toLocaleString("de-DE") : "—"}</td><td><div class="bd">${bd}</div></td></tr>`;
    }).join("");
    $("#modal-card").innerHTML = `
      <div class="mh"><button class="x">✕</button><h3>${s.name}</h3><div class="sub">${s.format}-Feed · ${sm.records} Artikel</div>
        <div class="row"><div class="b"><div class="n">${sm.score}</div><div class="l">Score</div></div>
          <div class="b"><div class="n">${sm.rows_clean}</div><div class="l">Sauber</div></div>
          <div class="b"><div class="n">${sm.error_count}</div><div class="l">Fehler</div></div>
          <div class="b"><div class="n">${sm.warning_count}</div><div class="l">Warnungen</div></div></div></div>
      <div class="mb"><h4>Aktionsliste für diesen Lieferanten</h4><div class="fixlist">${fixes}</div>
        <h4>Artikel-Details</h4><table class="mt"><thead><tr><th>Art.-Nr.</th><th>Name</th><th>ab</th><th>Bestand</th><th>Befunde</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    const m = $("#modal"); m.classList.add("open"); m.setAttribute("aria-hidden", "false");
    $("#modal-card .x").addEventListener("click", closeModal);
  }
  function closeModal() { const m = $("#modal"); m.classList.remove("open"); m.setAttribute("aria-hidden", "true"); }
  $("#modal").addEventListener("click", e => { if (e.target.id === "modal") closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  /* ---- scroll + reveal ---- */
  addEventListener("scroll", () => $("#hdr").classList.toggle("scrolled", scrollY > 6), { passive: true });
  const io = new IntersectionObserver(ents => ents.forEach(e => {
    if (!e.isIntersecting) return; const t = e.target; t.classList.add("in");
    t.querySelectorAll(".cnt").forEach(n => countUp(n, +n.dataset.n, 1200, +(n.dataset.d || 0)));
    t.querySelectorAll(".sup-track i,.track i").forEach(b => b.style.width = b.dataset.w + "%");
    io.unobserve(t);
  }), { threshold: .14 });
  document.querySelectorAll(".reveal,.sup,.ib").forEach(x => io.observe(x));
})();
