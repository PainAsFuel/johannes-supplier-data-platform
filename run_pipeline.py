"""
End-to-end pipeline entry point — the single command a scheduler (Cloud
Composer / Airflow) would call.

    python run_pipeline.py

Flow per supplier:  ingest -> persist raw -> normalize -> quality -> persist staged
Then across suppliers:  build single source of truth (+ version diff) -> render dashboard

In production each of these steps is an Airflow task; here they run in sequence
so the whole thing works offline with one command.
"""
import glob
import json
import os
from datetime import datetime, timezone

from src import ingest, normalize, quality, storage, report

ROOT = os.path.dirname(os.path.abspath(__file__))


def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def main():
    run_id = datetime.now(timezone.utc).strftime("run_%Y%m%d_%H%M%S")
    generated_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    model = load_json(os.path.join(ROOT, "config", "common_model.json"))
    required = [f for f, spec in model["fields"].items() if spec.get("required")]
    supplier_files = sorted(glob.glob(os.path.join(ROOT, "config", "suppliers", "*.json")))

    print(f"=== Supplier Data Platform :: {run_id} ===")
    print(f"Canonical model: {len(model['fields'])} fields | required: {required}\n")

    suppliers, all_normalized, all_issues = [], [], []

    for sf in supplier_files:
        cfg = load_json(sf)
        sid = cfg["supplier_id"]
        raw = ingest.ingest(cfg, ROOT)
        storage.persist_raw(ROOT, sid, run_id, raw)

        norm = normalize.normalize_all(raw, cfg, model)
        issues, summary = quality.run_quality(norm, required)
        storage.persist_staged(ROOT, sid, run_id, norm, issues)

        suppliers.append({"supplier_id": sid, "supplier_name": cfg["supplier_name"],
                          "records": norm, "issues": issues, "summary": summary})
        all_normalized.append(norm)
        all_issues.append(issues)

        print(f"  {cfg['supplier_name']:<34} score={summary['score']:>5}  "
              f"records={summary['records']:>2}  errors={summary['error_count']:>2}  "
              f"warnings={summary['warning_count']:>2}")

    sot, diff = storage.build_source_of_truth(ROOT, run_id, all_normalized, all_issues)
    report.render(ROOT, run_id, generated_at, suppliers, sot, diff)

    print(f"\nSource of truth: {len(sot)} products  "
          f"(+{len(diff['added'])} / ~{len(diff['changed'])} / -{len(diff['removed'])} vs previous run)")
    print(f"Dashboard: docs/index.html")
    print("Done.")


if __name__ == "__main__":
    main()
