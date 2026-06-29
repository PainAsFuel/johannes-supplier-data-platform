"""
SOURCE promotional-product data pipeline — single entry point.

    python run_pipeline.py

Per supplier:  ingest (BMEcat/Promidata/CSV/Excel) -> persist raw -> normalize ->
quality -> persist staged.  Across suppliers: build versioned single source of
truth, then export docs/data.js for the dashboard.

In production each stage is a Cloud Composer (Airflow) task writing to BigQuery.
"""
import glob, json, os
from datetime import datetime, timezone

from src import ingest, normalize, quality, storage

ROOT = os.path.dirname(os.path.abspath(__file__))
FORMAT_LABEL = {"bmecat": "BMEcat 1.2 XML", "promidata": "Promidata JSON",
                "csv": "CSV", "excel": "Excel (.xlsx)"}


def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def main():
    run_id = datetime.now(timezone.utc).strftime("run_%Y%m%d_%H%M%S")
    generated_at = datetime.now(timezone.utc).strftime("%d %b %Y, %H:%M UTC")
    model = load(os.path.join(ROOT, "config", "common_model.json"))

    print(f"=== SOURCE Product Data Pipeline :: {run_id} ===\n")
    suppliers, all_norm, all_issues = [], [], []

    for sf in sorted(glob.glob(os.path.join(ROOT, "config", "suppliers", "*.json"))):
        cfg = load(sf)
        sid = cfg["supplier_id"]
        raw = ingest.ingest(cfg, ROOT)
        storage.persist_raw(ROOT, sid, run_id, raw)
        norm = normalize.normalize_all(raw, cfg, model)
        issues, summary = quality.run_quality(norm)
        storage.persist_staged(ROOT, sid, run_id, norm, issues)

        products = [{**r, "_issues": iss} for r, iss in zip(norm, issues)]
        suppliers.append({"id": sid, "name": cfg["supplier_name"],
                          "format": FORMAT_LABEL.get(cfg["format"], cfg["format"]),
                          "summary": summary, "products": products})
        all_norm.append(norm); all_issues.append(issues)
        print(f"  {cfg['supplier_name']:<28} {FORMAT_LABEL.get(cfg['format']):<16} "
              f"score={summary['score']:>5}  recs={summary['records']:>2}  "
              f"err={summary['error_count']:>2}  warn={summary['warning_count']:>2}")

    sot, diff = storage.build_source_of_truth(ROOT, run_id, all_norm, all_issues)

    # ---- aggregate for the dashboard ----
    incoming = sum(s["summary"]["records"] for s in suppliers)
    total_err = sum(s["summary"]["error_count"] for s in suppliers)
    total_warn = sum(s["summary"]["warning_count"] for s in suppliers)
    avg_score = round(sum(s["summary"]["score"] for s in suppliers) / (len(suppliers) or 1), 1)
    cat_breakdown = {}
    for p in sot:
        c = p.get("category") or "Uncategorized"
        cat_breakdown[c] = cat_breakdown.get(c, 0) + 1
    issue_totals = {}
    for s in suppliers:
        for code, n in s["summary"]["code_tally"].items():
            issue_totals[code] = issue_totals.get(code, 0) + n

    data = {
        "generated_at": generated_at, "run_id": run_id,
        "kpis": {"suppliers": len(suppliers), "incoming": incoming, "published": len(sot),
                 "avg_score": avg_score, "errors": total_err, "warnings": total_warn,
                 "eco": sum(1 for p in sot if p.get("eco")), "categories": len(cat_breakdown)},
        "suppliers": suppliers, "catalog": sot,
        "category_breakdown": dict(sorted(cat_breakdown.items(), key=lambda kv: -kv[1])),
        "issue_totals": dict(sorted(issue_totals.items(), key=lambda kv: -kv[1])),
        "diff": {"added": len(diff["added"]), "changed": len(diff["changed"]),
                 "removed": len(diff["removed"]), "total": diff["total"]},
    }
    docs = os.path.join(ROOT, "docs")
    os.makedirs(docs, exist_ok=True)
    with open(os.path.join(docs, "data.js"), "w", encoding="utf-8") as f:
        f.write("window.SOURCE_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n")

    print(f"\n  Published to source of truth: {len(sot)} products across {len(cat_breakdown)} categories")
    print(f"  Avg quality score: {avg_score} | errors: {total_err} | warnings: {total_warn}")
    print(f"  Dashboard data -> docs/data.js")


if __name__ == "__main__":
    main()
