"""
Download the real product images (referenced in image_map.json) into docs/img/
named by SKU, so the dashboard is self-contained on any host (Vercel/Pages) and
never depends on cross-origin hotlinking.

Run after make_samples.py:  python tools/fetch_images.py
"""
import json, os, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTDIR = os.path.join(ROOT, "docs", "img")
os.makedirs(OUTDIR, exist_ok=True)

with open(os.path.join(ROOT, "data", "incoming", "image_map.json"), encoding="utf-8") as f:
    image_map = json.load(f)

ua = {"User-Agent": "Mozilla/5.0"}
ok = 0
for sku, url in image_map.items():
    dest = os.path.join(OUTDIR, f"{sku}.jpg")
    try:
        req = urllib.request.Request(url, headers=ua)
        with urllib.request.urlopen(req, timeout=30) as r, open(dest, "wb") as out:
            out.write(r.read())
        ok += 1
        print(f"  {sku}.jpg")
    except Exception as e:
        print(f"  FAILED {sku}: {e}")

print(f"Downloaded {ok}/{len(image_map)} images into docs/img/")
