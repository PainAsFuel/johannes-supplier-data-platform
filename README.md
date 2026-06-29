# Supplier Product Data Platform — working demo

A small but **complete, runnable** prototype of the product-data platform described in the job:
ingest product feeds from many suppliers in many formats, normalize them into one canonical
model, score and report on data quality, and publish a versioned **single source of truth**.

Built as a local simulation of the target Google Cloud stack (BigQuery · Dataform ·
Cloud Composer · Terraform) so it runs end-to-end with **one command and zero cloud setup**.
See [`GCP_PRODUCTION_MAPPING.md`](GCP_PRODUCTION_MAPPING.md) for how each piece maps to GCP.

> **Live dashboard:** _(GitHub Pages link goes here once deployed)_
> Or open `docs/index.html` locally after running the pipeline.

---

## What it demonstrates (matches the brief point-for-point)

| Brief requirement | In this demo |
|---|---|
| 50+ suppliers, **x formats** | 4 suppliers in **CSV, Excel, XML, and REST-API/JSON** — adding more is a config file, not code |
| **Fully automate transformation** | `python run_pipeline.py` runs ingest → normalize → quality → publish |
| Normalize to a common model | `config/common_model.json` — one schema, with currency→EUR, unit→kg, category mapping |
| **Analyse & report data quality to suppliers** | Per-supplier HTML report = a plain-English fix list (`docs/suppliers/*.html`) |
| **Single source of truth, versioned** | `warehouse/transformed/products_current.json` + immutable snapshot & diff per run |
| Migrate Talend ETL | Transformation rules live in config + small modules, the migration target shape |

---

## Quickstart

```bash
pip install -r requirements.txt
python tools/make_samples.py   # writes 4 messy sample feeds into data/incoming/
python run_pipeline.py         # runs the full pipeline, writes docs/index.html
# open docs/index.html
```

Sample run output:

```
ACME Supplies (CSV feed)        score= 31.4  records= 7  errors= 5  warnings= 6
Globex GmbH (Excel feed)        score= 93.3  records= 6  errors= 0  warnings= 1
Initech Ltd (XML feed)          score= 52.0  records= 5  errors= 3  warnings= 1
Umbrella Corp (REST API feed)   score= 30.0  records= 4  errors= 3  warnings= 6
Source of truth: 14 products
```

## Architecture

```
config/common_model.json        canonical product model + currency/category maps
config/suppliers/*.json          one mapping file PER SUPPLIER (the only thing you add)
data/incoming/                   raw supplier feeds (CSV / XLSX / XML / JSON)
src/
  ingest.py        read any format -> raw records
  normalize.py     map -> common model (currency, units, categories)
  quality.py       validation rules + transparent 0-100 score
  storage.py       raw / staged / transformed layers + version diff
  report.py        static HTML dashboard + per-supplier reports
run_pipeline.py    orchestrator (= one Airflow DAG run)
warehouse/         generated medallion layers (raw -> staged -> transformed -> versions)
docs/              generated dashboard (served by GitHub Pages)
```

### Onboarding a new supplier
Drop their feed in `data/incoming/` and add one `config/suppliers/<id>.json` mapping their
column names to the common model. No pipeline code changes. That is the whole point of the
framework — it scales to supplier #51 without growing.

### Data lineage / single source of truth
Each run keeps the exact bytes received (`warehouse/raw/`), the normalized+annotated version
(`warehouse/staged/`), and promotes **only error-free records** to the current product table.
Every run also writes an immutable snapshot and a diff (`added` / `changed` / `removed` SKUs)
under `warehouse/versions/<run_id>/`, so you can trace exactly what changed between feeds.

## Roadmap to production
- Swap local JSON layers for **BigQuery** datasets (raw / staging / mart)
- Move SQL transforms into **Dataform** with tests & assertions
- Schedule with **Cloud Composer (Airflow)**; one task per stage, retries + alerting
- Provision everything with **Terraform**
- Auto-email the per-supplier quality report (PDF/HTML) on a schedule

See `GCP_PRODUCTION_MAPPING.md`, plus the illustrative `terraform/`, `dataform/`, and
`airflow/` folders for the intended shape.

---
_Demo by Yaroslav for the Product Data Management Platform role._
