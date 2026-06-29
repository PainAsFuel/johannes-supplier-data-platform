"""
Storage layer: simulates the BigQuery medallion architecture on local disk.

  warehouse/raw/        <- exactly what the supplier sent (audit trail)
  warehouse/staged/     <- normalized + quality-annotated
  warehouse/transformed/products_current.json  <- the SINGLE SOURCE OF TRUTH
  warehouse/versions/   <- immutable snapshot per run + diff vs previous

In production these are BigQuery datasets (raw / staging / mart) and the
"versions" are time-travel snapshots / partitioned tables. See docs/GCP_PRODUCTION_MAPPING.md.
"""
import json
import os

CLEAN_FIELDS = ["sku", "gtin", "title", "brand", "category", "price_eur",
                "stock_qty", "weight_kg", "image_url", "description"]


def _write_json(path, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, indent=2, ensure_ascii=False)


def persist_raw(root, supplier_id, run_id, raw_records):
    _write_json(os.path.join(root, "warehouse", "raw", supplier_id, f"{run_id}.json"), raw_records)


def persist_staged(root, supplier_id, run_id, normalized, issues_per_record):
    annotated = [{**rec, "_issues": issues} for rec, issues in zip(normalized, issues_per_record)]
    _write_json(os.path.join(root, "warehouse", "staged", supplier_id, f"{run_id}.json"), annotated)


def _clean(rec):
    return {k: rec.get(k) for k in CLEAN_FIELDS}


def build_source_of_truth(root, run_id, all_normalized, all_issues):
    """Promote only error-free records into the current product table, then
    write an immutable version snapshot + a diff against the previous version."""
    current = []
    for normalized, issues_per_record in zip(all_normalized, all_issues):
        for rec, issues in zip(normalized, issues_per_record):
            if not any(i["severity"] == "error" for i in issues):
                current.append(_clean(rec))

    # de-dupe by sku, last wins (keeps SoT unique)
    by_sku = {r["sku"]: r for r in current if r.get("sku")}
    current = list(by_sku.values())

    transformed_dir = os.path.join(root, "warehouse", "transformed")
    sot_path = os.path.join(transformed_dir, "products_current.json")

    prev = {}
    if os.path.exists(sot_path):
        with open(sot_path, encoding="utf-8") as f:
            prev = {r["sku"]: r for r in json.load(f)}

    added = [s for s in by_sku if s not in prev]
    removed = [s for s in prev if s not in by_sku]
    changed = [s for s in by_sku if s in prev and by_sku[s] != prev[s]]

    _write_json(sot_path, current)
    _write_json(os.path.join(root, "warehouse", "versions", run_id, "products.json"), current)

    diff = {"run_id": run_id, "total": len(current),
            "added": added, "removed": removed, "changed": changed}
    _write_json(os.path.join(root, "warehouse", "versions", run_id, "diff.json"), diff)

    # append to version manifest
    manifest_path = os.path.join(root, "warehouse", "versions", "manifest.json")
    manifest = []
    if os.path.exists(manifest_path):
        with open(manifest_path, encoding="utf-8") as f:
            manifest = json.load(f)
    manifest.append({"run_id": run_id, "total": len(current),
                     "added": len(added), "removed": len(removed), "changed": len(changed)})
    _write_json(manifest_path, manifest)

    return current, diff
