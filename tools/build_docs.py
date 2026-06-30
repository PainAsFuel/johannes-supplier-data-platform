"""
Convert the design markdown docs into branded, standalone HTML pages served on the
same domain as the dashboard (docs/system-design.html, etc.).

Run:  python tools/build_docs.py
"""
import os, re
import markdown

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = [
    ("design/SYSTEM_DESIGN.md", "system-design.html", "System Design"),
    ("design/ALGORITHMS.md", "algorithms.html", "Algorithmen"),
    ("design/DATA_MODEL.md", "data-model.html", "Datenmodell"),
]
LINKMAP = {"SYSTEM_DESIGN.md": "system-design.html", "ALGORITHMS.md": "algorithms.html",
           "DATA_MODEL.md": "data-model.html", "../GCP_PRODUCTION_MAPPING.md": "system-design.html"}

NAV = """<a href="index.html">← Dashboard</a>
<a href="system-design.html">System Design</a>
<a href="algorithms.html">Algorithmen</a>
<a href="data-model.html">Datenmodell</a>"""

TEMPLATE = """<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>SOURCE · {title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
:root{{--blue:#003D7A;--orange:#F39200;--ink:#2b2f36;--muted:#6b7280;--bg:#f4f6f9;--surface:#fff;--line:#e6eaf0}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:"Open Sans",system-ui,sans-serif;color:var(--ink);background:var(--bg);line-height:1.65;-webkit-font-smoothing:antialiased}}
.bar{{position:sticky;top:0;z-index:10;background:rgba(255,255,255,.94);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}}
.bar .in{{max-width:920px;margin:0 auto;padding:14px 22px;display:flex;align-items:center;gap:22px;flex-wrap:wrap}}
.wm{{font-weight:800;letter-spacing:.16em;color:var(--blue);font-size:20px}}.wm::after{{content:"";display:inline-block;width:5px;height:5px;border-radius:50%;background:var(--orange);margin-left:3px}}
.bar a{{color:var(--muted);text-decoration:none;font-weight:600;font-size:14px}}.bar a:hover{{color:var(--blue)}}
.bar .nav{{margin-left:auto;display:flex;gap:20px;flex-wrap:wrap}}
.doc{{max-width:920px;margin:0 auto;padding:40px 22px 80px}}
.doc h1{{color:var(--blue);font-size:32px;font-weight:800;margin:8px 0 20px;letter-spacing:-.01em}}
.doc h2{{color:var(--blue);font-size:23px;font-weight:800;margin:34px 0 12px;padding-bottom:8px;border-bottom:2px solid var(--line)}}
.doc h3{{color:var(--blue);font-size:17px;font-weight:700;margin:22px 0 8px}}
.doc h4{{font-size:15px;font-weight:700;margin:16px 0 6px}}
.doc p{{margin:10px 0}}.doc ul,.doc ol{{margin:10px 0 10px 22px}}.doc li{{margin:4px 0}}
.doc a{{color:#0066CC}}.doc strong{{color:var(--ink)}}
.doc code{{background:#eef1f6;padding:2px 6px;border-radius:4px;font-family:ui-monospace,"Cascadia Code",monospace;font-size:13px;color:#b5410f}}
.doc pre{{background:#0b2545;color:#e6eefb;padding:16px 18px;border-radius:10px;overflow:auto;margin:14px 0;font-size:13px;line-height:1.5}}
.doc pre code{{background:none;color:inherit;padding:0}}
.doc table{{width:100%;border-collapse:collapse;margin:14px 0;font-size:14px;background:var(--surface);border:1px solid var(--line);border-radius:8px;overflow:hidden}}
.doc th{{background:var(--blue);color:#fff;text-align:left;padding:10px 12px;font-weight:700;font-size:13px}}
.doc td{{padding:9px 12px;border-top:1px solid var(--line);vertical-align:top}}
.doc tr:nth-child(even) td{{background:#fafbfd}}
.doc blockquote{{border-left:4px solid var(--orange);background:#fff7ec;padding:10px 16px;margin:14px 0;border-radius:0 8px 8px 0;color:#5b4a2e}}
.doc hr{{border:none;border-top:1px solid var(--line);margin:26px 0}}
</style></head>
<body>
<div class="bar"><div class="in"><a href="index.html" class="wm">SOURCE</a><div class="nav">{nav}</div></div></div>
<div class="doc">{body}</div>
</body></html>"""


def build():
    for md_path, out, title in DOCS:
        with open(os.path.join(ROOT, md_path), encoding="utf-8") as f:
            text = f.read()
        for a, b in LINKMAP.items():
            text = text.replace(a, b)
        html = markdown.markdown(text, extensions=["tables", "fenced_code", "toc"])
        page = TEMPLATE.format(title=title, nav=NAV, body=html)
        with open(os.path.join(ROOT, "docs", out), "w", encoding="utf-8") as f:
            f.write(page)
        print("  built docs/" + out)
    print("Docs HTML built.")


if __name__ == "__main__":
    build()
