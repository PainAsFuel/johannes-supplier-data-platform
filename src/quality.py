"""
Data-quality rules tuned for promotional products. Each finding has a severity:
  error   -> blocks the article from the published catalog (source of truth)
  warning -> publishable but needs the supplier to improve the feed

The per-supplier tally becomes a supplier-facing scorecard ("fix these").
"""
import re

IMAGE_RE = re.compile(r"^https://.+\.(jpg|jpeg|png|webp|gif)$", re.IGNORECASE)


def _ean13_valid(code):
    code = str(code or "").strip()
    if not re.fullmatch(r"\d{13}", code):
        return False
    ds = [int(c) for c in code]
    chk = (10 - sum(d * (3 if i % 2 else 1) for i, d in enumerate(ds[:12])) % 10) % 10
    return chk == ds[12]


REQUIRED = ["sku", "supplier_sku", "name", "price_from_eur", "min_order_qty", "stock_qty"]


def check_record(rec):
    issues = []

    def add(field, code, sev, msg):
        issues.append({"field": field, "code": code, "severity": sev, "message": msg})

    for f in REQUIRED:
        v = rec.get(f)
        if v is None or (isinstance(v, str) and not v.strip()):
            add(f, "missing_required", "error", f"Required field '{f}' is empty")

    tiers = rec.get("price_tiers") or []
    if not tiers:
        add("price_tiers", "missing_price", "error", "No price scale provided")
    else:
        if any((t.get("eur") or 0) <= 0 for t in tiers):
            add("price_tiers", "invalid_price", "error", "A price scale has a value ≤ 0")
        if len(tiers) == 1:
            add("price_tiers", "single_price_scale", "warning",
                "Only one price scale — promotional pricing needs quantity tiers")

    stock = rec.get("stock_qty")
    if stock is not None and stock < 0:
        add("stock_qty", "invalid_stock", "error", f"Negative stock ({stock})")

    ean = rec.get("ean")
    if not ean:
        add("ean", "missing_gtin", "warning", "EAN/GTIN missing")
    elif not _ean13_valid(ean):
        add("ean", "invalid_gtin", "warning", f"EAN '{ean}' is not a valid EAN-13")

    img = rec.get("image_url")
    if not img:
        add("image_url", "missing_image", "warning", "Product image missing")
    elif not IMAGE_RE.match(str(img)):
        add("image_url", "invalid_image", "warning", f"Image URL not https/image file: {img}")

    if not rec.get("print_methods"):
        add("print_methods", "missing_print_method", "warning",
            "No decoration / print method — core attribute for promo products")

    if not rec.get("category"):
        add("category", "unmapped_category", "warning",
            f"Category '{rec.get('_raw_category')}' not mapped to SOURCE taxonomy")

    if len((rec.get("description") or "").strip()) < 30:
        add("description", "short_description", "warning", "Description shorter than 30 chars")

    if not rec.get("colors"):
        add("colors", "no_colors", "warning", "No colour variants listed")

    return issues


def run_quality(records):
    issues = [check_record(r) for r in records]

    seen = {}
    for i, r in enumerate(records):
        if r.get("sku"):
            seen.setdefault(r["sku"], []).append(i)
    for sku, idxs in seen.items():
        if len(idxs) > 1:
            for i in idxs:
                issues[i].append({"field": "sku", "code": "duplicate_sku", "severity": "error",
                                  "message": f"Duplicate SKU '{sku}' ({len(idxs)}× in feed)"})

    n = len(records) or 1
    err = sum(1 for iss in issues for x in iss if x["severity"] == "error")
    warn = sum(1 for iss in issues for x in iss if x["severity"] == "warning")
    rows_clean = sum(1 for iss in issues if not iss)
    rows_err = sum(1 for iss in issues if any(x["severity"] == "error" for x in iss))
    rows_warn = n - rows_clean - rows_err
    score = round(100 * (rows_clean + 0.6 * rows_warn) / n, 1)

    tally = {}
    for iss in issues:
        for x in iss:
            tally[x["code"]] = tally.get(x["code"], 0) + 1

    summary = {"records": n, "rows_clean": rows_clean, "rows_warn_only": rows_warn,
               "rows_with_errors": rows_err, "error_count": err, "warning_count": warn,
               "score": score, "code_tally": dict(sorted(tally.items(), key=lambda kv: -kv[1]))}
    return issues, summary
