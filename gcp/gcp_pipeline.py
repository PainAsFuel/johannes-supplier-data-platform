"""
Bridge between the local pipeline and real BigQuery.

  python gcp/gcp_pipeline.py load   <project>   # ingest+normalize -> load staging.products into BigQuery
  python gcp/gcp_pipeline.py export <project>   # read Dataform-built tables -> write docs/data.js

Between the two, Dataform builds quality.* and mart.products in BigQuery.
Uses the `bq` CLI (ships with gcloud), so no extra Python packages are needed.
"""
import glob, json, os, subprocess, sys, types

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
from src import ingest, normalize  # noqa: E402

FORMAT_LABEL = {"bmecat": "BMEcat 1.2 XML", "promidata": "Promidata JSON", "csv": "CSV", "excel": "Excel (.xlsx)"}
BQ = "bq.cmd" if os.name == "nt" else "bq"


def _load_cfgs():
    out = {}
    for sf in sorted(glob.glob(os.path.join(ROOT, "config", "suppliers", "*.json"))):
        with open(sf, encoding="utf-8") as f:
            c = json.load(f)
        out[c["supplier_id"]] = c
    return out


def _model():
    with open(os.path.join(ROOT, "config", "common_model.json"), encoding="utf-8") as f:
        return json.load(f)


def _dec(b):
    if not b:
        return ""
    try:
        return b.decode("utf-8")
    except UnicodeDecodeError:
        return b.decode("cp1252", errors="replace")  # bq.cmd emits the Windows code page


def bq(args, inp=None):
    env = {**os.environ, "PYTHONUTF8": "1", "PYTHONIOENCODING": "utf-8"}  # force bq to emit UTF-8
    r = subprocess.run([BQ, "--quiet", "--headless"] + args,
                       input=(inp.encode("utf-8") if inp else None), capture_output=True, env=env)
    return types.SimpleNamespace(returncode=r.returncode, stdout=_dec(r.stdout), stderr=_dec(r.stderr))


def bq_query(project, sql):
    r = bq(["query", f"--project_id={project}", "--use_legacy_sql=false", "--format=json", "--max_rows=100000", sql])
    if r.returncode != 0:
        raise RuntimeError(r.stderr.strip())
    return json.loads(r.stdout or "[]")


# ----------------------------------------------------------------- LOAD
def cmd_load(project):
    model = _model()
    rows = []
    for sid, cfg in _load_cfgs().items():
        for rec in normalize.normalize_all(ingest.ingest(cfg, ROOT), cfg, model):
            rows.append({
                "supplier": rec["_supplier"], "supplier_name": rec["_supplier_name"],
                "sku": rec["sku"], "supplier_sku": rec["supplier_sku"], "ean": rec["ean"],
                "name": rec["name"], "manufacturer": rec["manufacturer"], "category": rec["category"],
                "raw_category": rec["_raw_category"], "material": rec["material"], "colors": rec["colors"],
                "price_from_eur": rec["price_from_eur"], "price_tiers": rec["price_tiers"],
                "min_order_qty": rec["min_order_qty"], "print_methods": rec["print_methods"],
                "print_area": rec["print_area"], "weight_kg": rec["weight_kg"], "eco": rec["eco"],
                "image_url": rec["image_url"], "stock_qty": rec["stock_qty"],
                "lead_time_days": rec["lead_time_days"], "description": rec["description"],
            })
    nd = os.path.join(ROOT, "gcp", "_staging.ndjson")
    with open(nd, "w", encoding="utf-8") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    print(f"Loading {len(rows)} rows -> {project}:staging.products")
    r = bq(["load", "--replace", "--source_format=NEWLINE_DELIMITED_JSON", "--autodetect",
            f"--project_id={project}", "staging.products", nd])
    print(r.stdout or r.stderr)
    if r.returncode != 0:
        sys.exit(1)
    print("Loaded into BigQuery staging.products")


# ----------------------------------------------------------------- EXPORT
def _f(v):
    try: return float(v)
    except (TypeError, ValueError): return None
def _i(v):
    f = _f(v); return int(f) if f is not None else None


def _tiers(v):
    return [{"qty": _i(t.get("qty")), "eur": _f(t.get("eur"))} for t in (v or [])]


def cmd_export(project):
    cfgs = _load_cfgs()
    fmt = {sid: FORMAT_LABEL.get(c["format"], c["format"]) for sid, c in cfgs.items()}

    mart = bq_query(project, "SELECT * FROM mart.products")
    catalog = []
    for r in mart:
        catalog.append({
            "sku": r["sku"], "supplier_sku": r["supplier_sku"], "_supplier": r["supplier"],
            "_supplier_name": r["supplier_name"], "ean": r["ean"], "name": r["name"],
            "manufacturer": r["manufacturer"], "category": r["category"], "material": r["material"],
            "colors": r.get("colors") or [], "price_from_eur": _f(r["price_from_eur"]),
            "price_tiers": _tiers(r.get("price_tiers")), "min_order_qty": _i(r["min_order_qty"]),
            "print_methods": r.get("print_methods") or [], "print_area": r["print_area"],
            "weight_kg": _f(r["weight_kg"]), "eco": (str(r.get("eco")).lower() == "true"),
            "image_url": r["image_url"], "stock_qty": _i(r["stock_qty"]),
            "lead_time_days": _i(r["lead_time_days"]), "description": r["description"],
        })

    scores = {r["supplier"]: r for r in bq_query(project, "SELECT * FROM quality.supplier_scores")}
    findings = bq_query(project, "SELECT supplier, code, COUNT(1) c FROM quality.findings GROUP BY supplier, code")
    tally = {}
    for r in findings:
        tally.setdefault(r["supplier"], {})[r["code"]] = _i(r["c"])

    annot = bq_query(project, "SELECT supplier, supplier_sku, name, price_from_eur, stock_qty, issues FROM quality.products_annotated ORDER BY supplier, supplier_sku")
    prods_by_sup = {}
    for r in annot:
        prods_by_sup.setdefault(r["supplier"], []).append({
            "supplier_sku": r["supplier_sku"], "name": r["name"], "price_from_eur": _f(r["price_from_eur"]),
            "stock_qty": _i(r["stock_qty"]),
            "_issues": [{"field": i.get("field"), "code": i.get("code"), "severity": i.get("severity"), "message": i.get("message")} for i in (r.get("issues") or [])],
        })

    suppliers = []
    for sid in cfgs:
        s = scores.get(sid, {})
        ct = dict(sorted(tally.get(sid, {}).items(), key=lambda kv: -kv[1]))
        suppliers.append({"id": sid, "name": s.get("supplier_name", cfgs[sid]["supplier_name"]), "format": fmt[sid],
            "summary": {"records": _i(s.get("records")) or 0, "rows_clean": _i(s.get("rows_clean")) or 0,
                "rows_warn_only": _i(s.get("rows_warn_only")) or 0, "rows_with_errors": _i(s.get("rows_with_errors")) or 0,
                "error_count": _i(s.get("error_count")) or 0, "warning_count": _i(s.get("warning_count")) or 0,
                "score": _f(s.get("score")) or 0, "code_tally": ct},
            "products": prods_by_sup.get(sid, [])})

    cat_b, issue_t = {}, {}
    for p in catalog:
        c = p["category"] or "Uncategorized"; cat_b[c] = cat_b.get(c, 0) + 1
    for sid, ct in tally.items():
        for code, n in ct.items():
            issue_t[code] = issue_t.get(code, 0) + n

    incoming = sum(s["summary"]["records"] for s in suppliers)
    avg = round(sum(s["summary"]["score"] for s in suppliers) / (len(suppliers) or 1), 1)
    data = {
        "generated_at": os.environ.get("RUN_TS", "live from BigQuery"), "run_id": os.environ.get("RUN_ID", "bq_live"),
        "kpis": {"suppliers": len(suppliers), "incoming": incoming, "published": len(catalog), "avg_score": avg,
            "errors": sum(s["summary"]["error_count"] for s in suppliers), "warnings": sum(s["summary"]["warning_count"] for s in suppliers),
            "eco": sum(1 for p in catalog if p["eco"]), "categories": len(cat_b)},
        "suppliers": suppliers, "catalog": catalog,
        "category_breakdown": dict(sorted(cat_b.items(), key=lambda kv: -kv[1])),
        "issue_totals": dict(sorted(issue_t.items(), key=lambda kv: -kv[1])),
        "diff": {"added": len(catalog), "changed": 0, "removed": 0, "total": len(catalog)},
        "engine": "Google BigQuery + Dataform (provisioned by Terraform)",
    }
    with open(os.path.join(ROOT, "docs", "data.js"), "w", encoding="utf-8") as f:
        f.write("window.SOURCE_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n")
    print(f"Exported {len(catalog)} mart products + {len(suppliers)} suppliers from BigQuery -> docs/data.js")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("usage: gcp_pipeline.py load|export <project_id>"); sys.exit(2)
    {"load": cmd_load, "export": cmd_export}[sys.argv[1]](sys.argv[2])
