/* SOURCE Product Data Platform — dashboard renderer & animations */
(function () {
  const D = window.SOURCE_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  const euro = n => n == null ? "—" : "€" + Number(n).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const CAT = {
    "Büro & Schreibgeräte":  { g: "linear-gradient(135deg,#0b3d91,#2f7bff)", i: "🖊️" },
    "Taschen & Gepäck":      { g: "linear-gradient(135deg,#7c3aed,#a855f7)", i: "🎒" },
    "Küche & Zuhause":       { g: "linear-gradient(135deg,#0891b2,#22d3ee)", i: "🍶" },
    "Elektronik & Mechanik": { g: "linear-gradient(135deg,#1e293b,#475569)", i: "🔌" },
    "Streuartikel":          { g: "linear-gradient(135deg,#ff6b1a,#ff9248)", i: "🧸" },
    "Bekleidung":            { g: "linear-gradient(135deg,#db2777,#f472b6)", i: "👕" },
    "Auto & Reisen":         { g: "linear-gradient(135deg,#0d9488,#2dd4bf)", i: "🚗" },
    "Werkzeug":              { g: "linear-gradient(135deg,#475569,#94a3b8)", i: "🔧" },
    "Wellness & Kosmetik":   { g: "linear-gradient(135deg,#e11d48,#fb7185)", i: "🧴" },
    "Essen & Trinken":       { g: "linear-gradient(135deg,#d97706,#fbbf24)", i: "🍫" },
    "Uncategorized":         { g: "linear-gradient(135deg,#64748b,#94a3b8)", i: "📦" }
  };
  const catOf = c => CAT[c] || CAT["Uncategorized"];
  const DONUT_COLORS = ["#0b3d91", "#ff6b1a", "#0891b2", "#7c3aed", "#16a34a", "#db2777", "#64748b", "#f59e0b"];

  const COLOR_HEX = { blau: "#2f7bff", schwarz: "#1e293b", rot: "#ef4444", weiss: "#f1f5f9", "weiß": "#f1f5f9",
    grün: "#16a34a", gruen: "#16a34a", silber: "#cbd5e1", anthrazit: "#374151", navy: "#1e3a8a", grau: "#9ca3af",
    natur: "#e7d5b0", beige: "#e7d5b0", braun: "#92633b", gelb: "#facc15", transparent: "#e5edff", bunt: "#a855f7" };
  const colHex = c => COLOR_HEX[(c || "").toLowerCase()] || "#cbd5e1";

  const ISSUE_LABEL = {
    missing_required: "Missing required field", missing_price: "No price scale", invalid_price: "Invalid price (≤ 0)",
    single_price_scale: "Only one price tier", invalid_stock: "Negative stock", missing_gtin: "Missing EAN/GTIN",
    invalid_gtin: "Invalid EAN-13", missing_image: "Missing product image", invalid_image: "Invalid image URL",
    missing_print_method: "No print/decoration method", unmapped_category: "Unmapped category",
    short_description: "Description too short", no_colors: "No colour variants", duplicate_sku: "Duplicate SKU"
  };
  const ERROR_CODES = new Set(["missing_required", "missing_price", "invalid_price", "invalid_stock", "duplicate_sku"]);
  const scoreColor = s => s >= 80 ? "#16a34a" : s >= 60 ? "#f59e0b" : "#ef4444";
  const scoreBar = s => s >= 80 ? "linear-gradient(90deg,#16a34a,#4ade80)" : s >= 60 ? "linear-gradient(90deg,#f59e0b,#fbbf68)" : "linear-gradient(90deg,#ef4444,#f87171)";

  /* ---------- count-up ---------- */
  function countUp(node, target, dur = 1300, decimals = 0, suffix = "") {
    const start = performance.now();
    function step(now) {
      const p = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      node.textContent = (target * e).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else node.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(step);
  }

  /* ---------- hero ---------- */
  $("#hero-run").textContent = D.run_id;
  $("#nav-run").textContent = D.run_id.replace("run_", "");
  const k = D.kpis;
  const heroKpis = [
    { n: k.suppliers, l: "Supplier feeds", d: 0 },
    { n: k.incoming, l: "Records ingested", d: 0 },
    { n: k.published, l: "Published to source of truth", d: 0 },
    { n: k.avg_score, l: "Avg quality score", d: 0, score: true }
  ];
  const hk = $("#hero-kpis");
  heroKpis.forEach(x => {
    const c = el("div", "hk");
    c.innerHTML = `<div class="n" data-n="${x.n}" data-d="${x.d}">0</div><div class="l">${x.l}</div>`;
    hk.appendChild(c);
  });
  // hero counts animate immediately
  setTimeout(() => hk.querySelectorAll(".n").forEach(n => countUp(n, +n.dataset.n, 1400, +n.dataset.d)), 250);

  /* ---------- suppliers ---------- */
  const grid = $("#supplier-grid");
  D.suppliers.forEach((s, idx) => {
    const sm = s.summary, col = scoreColor(sm.score);
    const c = el("div", "supplier");
    c.style.setProperty("--bar", scoreBar(sm.score));
    c.innerHTML = `
      <div class="s-top"><div class="s-name">${s.name}</div><div class="s-fmt">${s.format}</div></div>
      <div class="s-score" style="color:${col}"><span class="cnt" data-n="${sm.score}" data-d="1">0</span><small>/100</small></div>
      <div class="s-bar"><i data-w="${sm.score}"></i></div>
      <div class="s-stats">
        <span class="c">● <b>${sm.rows_clean}</b> clean</span>
        <span class="e">● <b>${sm.error_count}</b> errors</span>
        <span class="w">● <b>${sm.warning_count}</b> warnings</span>
      </div>
      <div class="s-cta">View supplier report
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </div>`;
    c.addEventListener("click", () => openModal(idx));
    grid.appendChild(c);
  });

  /* ---------- pipeline flow ---------- */
  const STAGES = [
    { i: "📥", h: "Ingest", p: "BMEcat, Promidata, CSV & Excel adapters pull every supplier feed.", g: "Cloud Storage + Functions" },
    { i: "🧬", h: "Normalize", p: "Map to one product model: currency→EUR, units→kg, supplier categories → SOURCE taxonomy (Auto&nbsp;&amp;&nbsp;Reisen, Büro&nbsp;&amp;&nbsp;Schreibgeräte …).", g: "Dataform (staging)" },
    { i: "🔎", h: "Quality", p: "Score each feed; flag errors & warnings to report back to suppliers.", g: "Dataform assertions" },
    { i: "✅", h: "Source of truth", p: "Only error-free articles promoted to the governed catalog.", g: "BigQuery mart" },
    { i: "🕒", h: "Version", p: "Immutable snapshot + diff per run, so any state is reproducible.", g: "BigQuery snapshots" }
  ];
  const flow = $("#flow");
  STAGES.forEach((st, i) => {
    const s = el("div", "stage reveal");
    s.style.transitionDelay = (i * 80) + "ms";
    s.innerHTML = `<div class="ic">${st.i}</div><h4>${st.h}</h4><p>${st.p}</p><span class="gcp">${st.g}</span>` +
      (i < STAGES.length - 1 ? `<span class="arrow"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>` : "");
    flow.appendChild(s);
  });

  /* ---------- catalog ---------- */
  $("#catalog-count").textContent = D.catalog.length + " products";
  const cats = ["All", ...Object.keys(D.category_breakdown)];
  let activeCat = "All", q = "";
  const chips = $("#cat-chips");
  cats.forEach(cat => {
    const ch = el("div", "chip" + (cat === "All" ? " active" : ""), cat);
    ch.addEventListener("click", () => { activeCat = cat; chips.querySelectorAll(".chip").forEach(x => x.classList.toggle("active", x === ch)); drawCatalog(); });
    chips.appendChild(ch);
  });
  $("#search").addEventListener("input", e => { q = e.target.value.toLowerCase().trim(); drawCatalog(); });

  function prodCard(p, i) {
    const c = catOf(p.category);
    const dots = (p.colors || []).slice(0, 5).map(col => `<i title="${col}" style="background:${colHex(col)}"></i>`).join("");
    const tags = (p.print_methods || []).slice(0, 3).map(t => `<span class="tag">${t}</span>`).join("");
    const card = el("div", "prod");
    card.style.animationDelay = Math.min(i * 35, 500) + "ms";
    card.innerHTML = `
      <div class="prod-img" style="background:${c.g}">${c.i}${p.eco ? '<span class="prod-eco">ECO</span>' : ""}</div>
      <div class="prod-body">
        <div class="prod-cat">${p.category || "Uncategorized"}</div>
        <div class="prod-name">${p.name}</div>
        <div class="prod-sup">${p._supplier_name}</div>
        <div class="prod-meta">
          <div class="prod-price">from<b>${euro(p.price_from_eur)}</b></div>
          <div class="prod-dots">${dots}</div>
        </div>
        <div class="prod-tags">${tags}</div>
      </div>`;
    return card;
  }
  function drawCatalog() {
    const g = $("#catalog-grid"); g.innerHTML = "";
    const list = D.catalog.filter(p => {
      if (activeCat !== "All" && (p.category || "Uncategorized") !== activeCat) return false;
      if (!q) return true;
      return (p.name + " " + p._supplier_name + " " + (p.material || "") + " " + (p.colors || []).join(" ")).toLowerCase().includes(q);
    });
    if (!list.length) { g.appendChild(el("div", "empty", "No products match your search.")); return; }
    list.forEach((p, i) => g.appendChild(prodCard(p, i)));
  }
  drawCatalog();

  /* ---------- donut ---------- */
  function drawDonut() {
    const svg = $("#donut"), entries = Object.entries(D.category_breakdown);
    const total = entries.reduce((a, [, n]) => a + n, 0);
    const R = 80, C = 2 * Math.PI * R; let acc = 0;
    $("#donut-total").dataset.n = total;
    const legend = $("#donut-legend");
    entries.forEach(([cat, n], i) => {
      const frac = n / total, len = frac * C, color = DONUT_COLORS[i % DONUT_COLORS.length];
      const circ = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circ.setAttribute("cx", 100); circ.setAttribute("cy", 100); circ.setAttribute("r", R);
      circ.setAttribute("fill", "none"); circ.setAttribute("stroke", color); circ.setAttribute("stroke-width", 26);
      circ.setAttribute("stroke-dasharray", `${len} ${C}`);
      circ.setAttribute("stroke-dashoffset", len);
      circ.setAttribute("transform", `rotate(${-90 + acc / C * 360} 100 100)`);
      svg.appendChild(circ);
      requestAnimationFrame(() => requestAnimationFrame(() => circ.setAttribute("stroke-dashoffset", 0)));
      acc += len;
      legend.appendChild(el("div", "li", `<i style="background:${color}"></i>${cat}<span>${n}</span>`));
    });
  }
  drawDonut();

  /* ---------- issue bars ---------- */
  function drawIssues() {
    const wrap = $("#issue-bars"), entries = Object.entries(D.issue_totals);
    const max = Math.max(...entries.map(([, n]) => n), 1);
    entries.forEach(([code, n]) => {
      const sev = ERROR_CODES.has(code) ? "error" : "warning";
      const row = el("div", "ib sev-" + sev);
      row.innerHTML = `<span>${ISSUE_LABEL[code] || code}</span><div class="track"><i data-w="${(n / max * 100)}"></i></div><span class="n">${n}</span>`;
      wrap.appendChild(row);
    });
  }
  drawIssues();

  /* ---------- footer ---------- */
  $("#foot-meta").innerHTML =
    `<div>Generated <b>${D.generated_at}</b></div>
     <div>Run <b>${D.run_id}</b></div>
     <div>Source of truth: <b>${D.diff.total}</b> products · +${D.diff.added} / ~${D.diff.changed} / -${D.diff.removed} vs previous</div>`;

  /* ---------- modal ---------- */
  function openModal(idx) {
    const s = D.suppliers[idx], sm = s.summary, col = scoreColor(sm.score);
    const fixes = Object.entries(sm.code_tally).map(([code, n]) => {
      const sev = ERROR_CODES.has(code) ? "error" : "warning";
      return `<div class="fix ${sev}"><span class="cnt" style="color:${sev === "error" ? "var(--bad)" : "var(--warn)"}">${n}</span>
        <span class="lab">${ISSUE_LABEL[code] || code}</span><span class="code">${code}</span></div>`;
    }).join("") || `<div class="fix clean"><span class="cnt" style="color:var(--ok)">✓</span><span class="lab">No issues — feed is clean</span></div>`;

    const rows = s.products.map(p => {
      const badges = (p._issues || []).map(i =>
        `<span class="b-pill ${i.severity === "error" ? "e" : "w"}">${i.message}</span>`).join("") || '<span class="b-ok">OK</span>';
      return `<tr><td><b>${p.supplier_sku || "—"}</b></td><td>${p.name || "—"}</td>
        <td>${euro(p.price_from_eur)}</td><td>${p.stock_qty != null ? p.stock_qty.toLocaleString("de-DE") : "—"}</td>
        <td><div class="badges">${badges}</div></td></tr>`;
    }).join("");

    $("#modal-card").innerHTML = `
      <div class="m-head">
        <button class="x" aria-label="Close">✕</button>
        <h3>${s.name}</h3>
        <div class="sub">${s.format} feed · ${sm.records} articles</div>
        <div class="m-score">
          <div class="b"><div class="n" style="color:#fff">${sm.score}</div><div class="l">Quality score</div></div>
          <div class="b"><div class="n">${sm.rows_clean}</div><div class="l">Clean</div></div>
          <div class="b"><div class="n">${sm.error_count}</div><div class="l">Errors</div></div>
          <div class="b"><div class="n">${sm.warning_count}</div><div class="l">Warnings</div></div>
        </div>
      </div>
      <div class="m-body">
        <h4>Action list for this supplier</h4>
        <div class="fixlist">${fixes}</div>
        <h4>Article-level detail</h4>
        <table class="m-table"><thead><tr><th>Art. no</th><th>Name</th><th>From</th><th>Stock</th><th>Findings</th></tr></thead>
        <tbody>${rows}</tbody></table>
      </div>`;
    const m = $("#modal");
    m.classList.add("open"); m.setAttribute("aria-hidden", "false");
    $("#modal-card .x").addEventListener("click", closeModal);
  }
  function closeModal() { const m = $("#modal"); m.classList.remove("open"); m.setAttribute("aria-hidden", "true"); }
  $("#modal").addEventListener("click", e => { if (e.target.id === "modal") closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  /* ---------- nav scroll ---------- */
  const nav = $("#nav");
  addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 10), { passive: true });

  /* ---------- reveal + triggered animations ---------- */
  const io = new IntersectionObserver((ents) => {
    ents.forEach(e => {
      if (!e.isIntersecting) return;
      const t = e.target; t.classList.add("in");
      t.querySelectorAll(".cnt").forEach(n => countUp(n, +n.dataset.n, 1200, +(n.dataset.d || 0)));
      t.querySelectorAll(".s-bar i,.track i").forEach(b => { b.style.width = b.dataset.w + "%"; });
      io.unobserve(t);
    });
  }, { threshold: .15 });
  document.querySelectorAll(".reveal").forEach(x => io.observe(x));
  // observe supplier cards & issue rows individually for their counters/bars
  document.querySelectorAll(".supplier,.ib").forEach(x => io.observe(x));
})();
