"""
Reporting layer: render a static HTML dashboard + per-supplier quality reports
into docs/ (served directly by GitHub Pages, no build step).

The per-supplier page is the "supplier-facing data quality report" mentioned in
the brief: a plain-English list of exactly what each supplier needs to fix.
"""
import html
import json
import os

CSS = """
:root{--bg:#0d1117;--card:#161b22;--line:#27303b;--mut:#8b97a7;--fg:#e6edf3;--accent:#3b82f6}
*{box-sizing:border-box}body{margin:0;font:15px/1.5 -apple-system,Segoe UI,Roboto,Helvetica,Arial;background:var(--bg);color:var(--fg)}
a{color:#7aa2ff;text-decoration:none}a:hover{text-decoration:underline}
.wrap{max-width:1080px;margin:0 auto;padding:32px 20px 64px}
.head{border-bottom:1px solid var(--line);padding-bottom:18px;margin-bottom:26px}
.head h1{margin:0 0 4px;font-size:24px}.head .sub{color:var(--mut);font-size:13px}
.badge{display:inline-block;padding:2px 9px;border-radius:999px;font-size:12px;font-weight:600}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:24px 0}
.kpi{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px}
.kpi .n{font-size:28px;font-weight:700}.kpi .l{color:var(--mut);font-size:12px;text-transform:uppercase;letter-spacing:.04em}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:20px;margin:18px 0}
.card h2{margin:0 0 14px;font-size:16px}
table{width:100%;border-collapse:collapse;font-size:13px}
th,td{text-align:left;padding:9px 10px;border-bottom:1px solid var(--line);vertical-align:top}
th{color:var(--mut);font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.04em}
tr:hover td{background:#1b222c}
.err{color:#ff7b72}.warn{color:#e3b341}.ok{color:#3fb950}
.pill{font-size:11px;padding:1px 7px;border-radius:6px;border:1px solid var(--line);margin:2px 4px 2px 0;display:inline-block}
.pill.e{color:#ff7b72;border-color:#5a2a2a}.pill.w{color:#e3b341;border-color:#5a4a1a}
.foot{color:var(--mut);font-size:12px;margin-top:30px;border-top:1px solid var(--line);padding-top:16px}
.diff span{margin-right:16px}
"""


def _score_color(s):
    return "#3fb950" if s >= 85 else ("#e3b341" if s >= 60 else "#ff7b72")


def _esc(v):
    return html.escape("" if v is None else str(v))


def _page(title, body):
    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{_esc(title)}</title><style>{CSS}</style>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script></head>
<body><div class="wrap">{body}</div></body></html>"""


def render(root, run_id, generated_at, suppliers, sot, diff):
    docs = os.path.join(root, "docs")
    os.makedirs(os.path.join(docs, "suppliers"), exist_ok=True)

    total_in = sum(s["summary"]["records"] for s in suppliers)
    total_err = sum(s["summary"]["error_count"] for s in suppliers)
    total_warn = sum(s["summary"]["warning_count"] for s in suppliers)
    avg_score = round(sum(s["summary"]["score"] for s in suppliers) / (len(suppliers) or 1), 1)

    # ---- main dashboard ----
    rows = ""
    labels, scores, colors = [], [], []
    for s in suppliers:
        sm = s["summary"]
        c = _score_color(sm["score"])
        labels.append(s["supplier_name"].split(" (")[0])
        scores.append(sm["score"]); colors.append(c)
        rows += f"""<tr>
<td><a href="suppliers/{s['supplier_id']}.html">{_esc(s['supplier_name'])}</a></td>
<td><span class="badge" style="background:{c}22;color:{c}">{sm['score']}</span></td>
<td>{sm['records']}</td><td class="ok">{sm['rows_clean']}</td>
<td class="err">{sm['error_count']}</td><td class="warn">{sm['warning_count']}</td></tr>"""

    diff_html = (f"<span class='ok'>+{len(diff['added'])} added</span>"
                 f"<span class='warn'>~{len(diff['changed'])} changed</span>"
                 f"<span class='err'>-{len(diff['removed'])} removed</span>"
                 f"<span class='mut'>= {diff['total']} products in source of truth</span>")

    body = f"""
<div class="head"><h1>Supplier Product Data — Quality &amp; Ingestion Dashboard</h1>
<div class="sub">Run <code>{_esc(run_id)}</code> · generated {_esc(generated_at)} · demo by Yaroslav</div></div>

<div class="kpis">
<div class="kpi"><div class="n">{len(suppliers)}</div><div class="l">Suppliers ingested</div></div>
<div class="kpi"><div class="n">{total_in}</div><div class="l">Incoming records</div></div>
<div class="kpi"><div class="n">{len(sot)}</div><div class="l">Promoted to source of truth</div></div>
<div class="kpi"><div class="n" style="color:{_score_color(avg_score)}">{avg_score}</div><div class="l">Avg quality score</div></div>
</div>

<div class="card"><h2>Quality score by supplier</h2><canvas id="c" height="90"></canvas></div>

<div class="card"><h2>Suppliers</h2>
<table><thead><tr><th>Supplier</th><th>Score</th><th>Records</th><th>Clean</th><th>Errors</th><th>Warnings</th></tr></thead>
<tbody>{rows}</tbody></table></div>

<div class="card"><h2>What changed this run (source-of-truth diff)</h2>
<div class="diff">{diff_html}</div>
<p class="sub" style="margin-top:10px">Every run writes an immutable snapshot under <code>warehouse/versions/{_esc(run_id)}/</code> so any prior state is fully reproducible.</p></div>

<div class="foot">Total across all suppliers: <span class="err">{total_err} errors</span>, <span class="warn">{total_warn} warnings</span>.
Only error-free records are promoted to the source of truth. This is a local simulation of the GCP pipeline — see <code>GCP_PRODUCTION_MAPPING.md</code>.</div>

<script>
new Chart(document.getElementById('c'),{{type:'bar',
data:{{labels:{json.dumps(labels)},datasets:[{{label:'Quality score',data:{json.dumps(scores)},
backgroundColor:{json.dumps(colors)},borderRadius:6}}]}},
options:{{plugins:{{legend:{{display:false}}}},scales:{{y:{{max:100,ticks:{{color:'#8b97a7'}},grid:{{color:'#27303b'}}}},
x:{{ticks:{{color:'#8b97a7'}},grid:{{display:false}}}}}}}}}});
</script>"""
    with open(os.path.join(docs, "index.html"), "w", encoding="utf-8") as f:
        f.write(_page("Supplier Data Quality Dashboard", body))

    # ---- per-supplier reports ----
    code_labels = {
        "missing_required": "Missing required field", "invalid_price": "Invalid / missing price",
        "invalid_stock": "Invalid / missing stock", "missing_gtin": "Missing barcode (GTIN)",
        "invalid_gtin": "Invalid EAN-13 barcode", "missing_image": "Missing product image",
        "invalid_image": "Invalid image URL", "unmapped_category": "Unrecognized category",
        "short_description": "Description too short", "duplicate_sku": "Duplicate SKU in feed",
    }
    for s in suppliers:
        sm = s["summary"]; c = _score_color(sm["score"])
        tally = "".join(
            f"<tr><td>{_esc(code_labels.get(code, code))}</td><td><code>{_esc(code)}</code></td><td>{n}</td></tr>"
            for code, n in sm["code_tally"].items()) or "<tr><td colspan=3 class='ok'>No issues 🎉</td></tr>"

        rec_rows = ""
        for rec, issues in zip(s["records"], s["issues"]):
            badges = "".join(
                f"<span class='pill {'e' if i['severity']=='error' else 'w'}'>{_esc(i['message'])}</span>"
                for i in issues) or "<span class='ok'>OK</span>"
            rec_rows += f"""<tr><td>{_esc(rec.get('sku'))}</td><td>{_esc(rec.get('title'))}</td>
<td>{_esc(rec.get('price_eur'))} €</td><td>{_esc(rec.get('stock_qty'))}</td><td>{badges}</td></tr>"""

        body = f"""
<div class="head"><h1>{_esc(s['supplier_name'])}</h1>
<div class="sub"><a href="../index.html">&larr; back to dashboard</a> · run {_esc(run_id)}</div></div>

<div class="kpis">
<div class="kpi"><div class="n" style="color:{c}">{sm['score']}</div><div class="l">Quality score</div></div>
<div class="kpi"><div class="n">{sm['records']}</div><div class="l">Records</div></div>
<div class="kpi"><div class="n err">{sm['error_count']}</div><div class="l">Errors</div></div>
<div class="kpi"><div class="n warn">{sm['warning_count']}</div><div class="l">Warnings</div></div>
</div>

<div class="card"><h2>Action list for this supplier</h2>
<table><thead><tr><th>Issue</th><th>Code</th><th>Count</th></tr></thead><tbody>{tally}</tbody></table></div>

<div class="card"><h2>Record-level detail</h2>
<table><thead><tr><th>SKU</th><th>Title</th><th>Price</th><th>Stock</th><th>Findings</th></tr></thead>
<tbody>{rec_rows}</tbody></table></div>

<div class="foot">This report can be exported to PDF / emailed to the supplier automatically (see roadmap in README).</div>"""
        with open(os.path.join(docs, "suppliers", f"{s['supplier_id']}.html"), "w", encoding="utf-8") as f:
            f.write(_page(s["supplier_name"], body))
