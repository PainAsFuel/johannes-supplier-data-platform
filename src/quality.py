"""
Data-quality layer: run validation rules over normalized records.

Each rule yields zero or more issues. Issues carry a severity so we can
produce both an internal score and a supplier-facing report ("here is exactly
what to fix in your feed"). Rules are plain functions => easy to add new ones.
"""
import re

IMAGE_RE = re.compile(r"^https://.+\.(jpg|jpeg|png|webp|gif)$", re.IGNORECASE)


def _ean13_valid(code):
    code = str(code or "").strip()
    if not re.fullmatch(r"\d{13}", code):
        return False
    digits = [int(c) for c in code]
    checksum = (10 - sum(d * (3 if i % 2 else 1) for i, d in enumerate(digits[:12])) % 10) % 10
    return checksum == digits[12]


def check_record(rec, required_fields):
    """Return a list of issue dicts for one normalized record."""
    issues = []

    def add(field, code, severity, message):
        issues.append({"field": field, "code": code, "severity": severity, "message": message})

    # required fields present
    for f in required_fields:
        v = rec.get(f)
        if v is None or (isinstance(v, str) and v.strip() == ""):
            add(f, "missing_required", "error", f"Required field '{f}' is empty")

    # price sanity
    price = rec.get("price_eur")
    if price is None:
        add("price_eur", "invalid_price", "error", "Price missing or not convertible to EUR")
    elif price <= 0:
        add("price_eur", "invalid_price", "error", f"Price must be > 0 (got {price})")

    # stock sanity
    stock = rec.get("stock_qty")
    if stock is None:
        add("stock_qty", "invalid_stock", "error", "Stock quantity missing or non-numeric")
    elif stock < 0:
        add("stock_qty", "invalid_stock", "error", f"Stock quantity is negative ({stock})")

    # GTIN / barcode
    gtin = rec.get("gtin")
    if not gtin:
        add("gtin", "missing_gtin", "warning", "GTIN/barcode missing")
    elif not _ean13_valid(gtin):
        add("gtin", "invalid_gtin", "warning", f"GTIN '{gtin}' is not a valid EAN-13")

    # image
    img = rec.get("image_url")
    if not img:
        add("image_url", "missing_image", "warning", "Product image URL missing")
    elif not IMAGE_RE.match(str(img)):
        add("image_url", "invalid_image", "warning", f"Image URL not https/image file: {img}")

    # category mapping
    if not rec.get("category"):
        add("category", "unmapped_category", "warning",
            f"Category '{rec.get('_raw_category')}' not in our taxonomy")

    # description
    desc = rec.get("description") or ""
    if len(desc.strip()) < 20:
        add("description", "short_description", "warning", "Description shorter than 20 chars")

    return issues


def score_supplier(records, issues_per_record):
    """Compute a transparent 0-100 quality score for the supplier batch.

    Row-based and intuitive: a clean row counts 1.0, a row with only warnings
    counts 0.6 (usable but needs attention), a row with any error counts 0.0
    (blocked from the source of truth)."""
    n = len(records) or 1
    error_count = sum(1 for issues in issues_per_record for i in issues if i["severity"] == "error")
    warning_count = sum(1 for issues in issues_per_record for i in issues if i["severity"] == "warning")
    rows_clean = sum(1 for issues in issues_per_record if not issues)
    rows_with_errors = sum(1 for issues in issues_per_record if any(i["severity"] == "error" for i in issues))
    rows_warn_only = n - rows_clean - rows_with_errors

    score = round(100 * (rows_clean * 1.0 + rows_warn_only * 0.6) / n, 1)

    # tally issue codes for the supplier report
    code_tally = {}
    for issues in issues_per_record:
        for i in issues:
            code_tally[i["code"]] = code_tally.get(i["code"], 0) + 1

    return {
        "records": n,
        "rows_clean": rows_clean,
        "rows_with_errors": rows_with_errors,
        "error_count": error_count,
        "warning_count": warning_count,
        "score": score,
        "code_tally": dict(sorted(code_tally.items(), key=lambda kv: -kv[1])),
    }


def run_quality(records, required_fields):
    issues_per_record = [check_record(r, required_fields) for r in records]

    # batch-level rule: duplicate SKUs within the same supplier feed
    seen = {}
    for idx, rec in enumerate(records):
        sku = rec.get("sku")
        if sku:
            seen.setdefault(sku, []).append(idx)
    for sku, idxs in seen.items():
        if len(idxs) > 1:
            for idx in idxs:
                issues_per_record[idx].append(
                    {"field": "sku", "code": "duplicate_sku", "severity": "error",
                     "message": f"Duplicate SKU '{sku}' appears {len(idxs)}x in this feed"})

    summary = score_supplier(records, issues_per_record)
    return issues_per_record, summary
