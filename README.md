# SOURCE — Promotional-Product Data Platform (working demo)

A runnable prototype of the product-data platform from the job: ingest promotional-product
feeds from many suppliers **in the formats the industry actually uses**, normalize them into
one product model, score & report data quality back to suppliers, and publish a **versioned
single source of truth** — all on a GCP-native architecture (BigQuery · Dataform · Cloud
Composer · Terraform).

It runs end-to-end with **one command and no cloud setup**, and ships with an animated,
SOURCE-branded dashboard.

> **🔗 Live dashboard:** https://painasfuel.github.io/johannes-supplier-data-platform/
> Or open `docs/index.html` after running the pipeline.

> Sample supplier/product names (uma, Halfar, mbw, REFLECTS) are illustrative demo data, not a real catalog.

---

## Why this is built for *your* business specifically

- **Real promo-industry formats.** Adapters for **BMEcat 1.2 XML**, **Promidata JSON**, plus
  CSV & Excel — the formats SOURCE actually receives. One adapter per *standard* means most of
  your 50+ suppliers are covered out of the box.
- **Promo-specific quality rules.** Quantity **price scales**, **min order quantity**,
  **print/decoration methods**, EAN-13, eco flags, colour variants, images — not generic ETL checks.
- **Supplier scorecards.** Each feed gets a score + a plain-English fix list you can send back
  to the supplier (exactly the "report quality back to suppliers" requirement).
- **Single source of truth.** Only error-free articles are promoted; every run is snapshotted
  and diffed so you can trace what changed between feeds.

| Job requirement | In this demo |
|---|---|
| 50+ suppliers, **x formats** | BMEcat / Promidata / CSV / Excel adapters; new supplier = one config file |
| Fully automate transformation | `python run_pipeline.py` runs ingest → normalize → quality → publish |
| Analyse & **report data quality to suppliers** | Per-supplier scorecard + fix list (click a supplier in the dashboard) |
| **Single source of truth**, versioned | `warehouse/transformed/products_current.json` + snapshot & diff per run |
| Migrate Talend ETL | Transformation rules isolated in adapters/config — the migration target shape |

## Quickstart

```bash
pip install -r requirements.txt
python tools/make_samples.py   # writes BMEcat/CSV/Excel/Promidata sample feeds
python run_pipeline.py         # runs the pipeline, writes docs/data.js
# open docs/index.html
```

Sample run:

```
Halfar System (Bags)        CSV             score= 84.0  recs= 5  err= 0  warn= 3
mbw (Giveaways & Plush)     Excel (.xlsx)   score= 52.0  recs= 5  err= 2  warn= 1
REFLECTS (Promidata feed)   Promidata JSON  score= 64.0  recs= 5  err= 1  warn= 3
uma Schreibgeräte           BMEcat 1.2 XML  score= 84.0  recs= 5  err= 0  warn= 3
Published to source of truth: 17 products across 5 categories
```

## Architecture

```
config/common_model.json     canonical promo-product model + category/currency maps
config/suppliers/*.json       one mapping file per supplier (format + metadata)
data/incoming/                sample feeds: uma_bmecat.xml, halfar_products.csv,
                              mbw_products.xlsx, reflects_promidata.json
src/
  ingest.py      adapters: BMEcat, Promidata, CSV, Excel
  normalize.py   map to common model (currency→EUR, units→kg, category, price scales)
  quality.py     promo-specific rules + 0-100 score + supplier tally
  storage.py     raw / staged / transformed layers + version diff
run_pipeline.py  orchestrator (= one Cloud Composer DAG run); exports docs/data.js
docs/            animated SOURCE-branded dashboard (index.html + styles.css + app.js)
warehouse/       generated medallion layers (raw → staged → transformed → versions)
```

### Onboarding a new supplier
BMEcat or Promidata supplier? Add one `config/suppliers/<id>.json` pointing at the feed — the
standard adapter handles the rest. CSV/Excel? Add a `field_map` in the same file. No pipeline
code changes.

## Roadmap to production (GCP)
Swap local JSON layers for **BigQuery** (raw / staging / mart), move SQL transforms into
**Dataform** with assertions, schedule with **Cloud Composer (Airflow)**, provision with
**Terraform**, and auto-email supplier scorecards. See `GCP_PRODUCTION_MAPPING.md` and the
illustrative `terraform/`, `dataform/`, `airflow/` folders.

---
_Demo by Yaroslav for SOURCE GmbH._
