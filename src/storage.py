"""
Storage: local simulation of the BigQuery medallion architecture.
  warehouse/raw/        immutable copy of what the supplier sent
  warehouse/staged/     normalized + quality-annotated
  warehouse/transformed/products_current.json   single source of truth (error-free only)
  warehouse/versions/<run>/   immutable snapshot + diff vs previous run
"""
import json, os

CLEAN = ["sku", "supplier_sku", "_supplier", "_supplier_name", "ean", "name", "manufacturer",
         "category", "material", "colors", "price_from_eur", "price_tiers", "min_order_qty",
         "print_methods", "print_area", "weight_kg", "eco", "image_url", "stock_qty",
         "lead_time_days", "description"]


def _w(path, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, indent=2, ensure_ascii=False)


def persist_raw(root, sid, run_id, raw):
    _w(os.path.join(root, "warehouse", "raw", sid, f"{run_id}.json"), raw)


def persist_staged(root, sid, run_id, norm, issues):
    _w(os.path.join(root, "warehouse", "staged", sid, f"{run_id}.json"),
       [{**r, "_issues": iss} for r, iss in zip(norm, issues)])


def build_source_of_truth(root, run_id, all_norm, all_issues):
    current = []
    for norm, issues in zip(all_norm, all_issues):
        for rec, iss in zip(norm, issues):
            if not any(x["severity"] == "error" for x in iss):
                current.append({k: rec.get(k) for k in CLEAN})
    by_sku = {r["sku"]: r for r in current if r.get("sku")}
    current = list(by_sku.values())

    sot_path = os.path.join(root, "warehouse", "transformed", "products_current.json")
    prev = {}
    if os.path.exists(sot_path):
        with open(sot_path, encoding="utf-8") as f:
            prev = {r["sku"]: r for r in json.load(f)}

    diff = {"run_id": run_id, "total": len(current),
            "added": [s for s in by_sku if s not in prev],
            "removed": [s for s in prev if s not in by_sku],
            "changed": [s for s in by_sku if s in prev and by_sku[s] != prev[s]]}

    _w(sot_path, current)
    _w(os.path.join(root, "warehouse", "versions", run_id, "products.json"), current)
    _w(os.path.join(root, "warehouse", "versions", run_id, "diff.json"), diff)
    return current, diff
