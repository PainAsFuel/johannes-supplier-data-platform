# System Design — SOURCE Product Data Platform

Author: Yaroslav · Demo for SOURCE GmbH
Status: reference architecture (the demo implements the logic locally; this doc describes the production GCP system)

---

## 1. Problem & goals

SOURCE receives product data from **50+ promotional-product suppliers** in heterogeneous formats
(BMEcat XML, Promidata JSON, CSV, Excel), of varying and often poor quality. We need to:

- **G1 — Automate** ingestion & transformation of every supplier feed into one model.
- **G2 — Quality**: measure data quality and report issues back to each supplier.
- **G3 — Single source of truth**: store versioned, transformed data; trace what changed.
- **G4 — Deliver** clean data to consuming systems (webshop, ERP, marketing).
- **G5 — Migrate** the existing Talend ETL without disrupting current operations.

### Non-functional requirements
| Concern | Target |
|---|---|
| Onboarding a new supplier | hours (config), not a code release |
| Freshness | daily full refresh + on-demand per supplier |
| Scale | 50+ suppliers, ~500k SKUs, millions of price-scale rows |
| Auditability | every published value traceable to the exact source feed & run |
| Cost | serverless / pay-per-use; no idle clusters |
| Idempotency | re-running a feed produces the same result |

---

## 2. High-level architecture

```
 Suppliers (50+)            Ingestion              Transform & Quality            Serve
 ┌───────────┐   feeds   ┌───────────────┐      ┌────────────────────┐     ┌──────────────┐
 │ BMEcat    │──────────▶│ Cloud Storage │      │  Dataform on        │     │ Webshop      │
 │ Promidata │  SFTP/API │  landing/<sup>│─────▶│  BigQuery           │────▶│ (Magento)    │
 │ CSV/Excel │           │               │ load │  raw → staging →    │     │ ERP / Feeds  │
 └───────────┘           └───────────────┘      │  quality → mart     │     │ Looker Studio│
        ▲                        │              └─────────┬──────────┘     └──────────────┘
        │ quality scorecards     │  orchestrated by                 │ snapshots + diff
        └────────────────────────┴──── Cloud Composer (Airflow) ────┴──────────────┐
                                                                                    ▼
                                                              BigQuery time-travel / version tables
   Everything provisioned by Terraform · CI/CD via GitHub Actions
```

### Medallion layering (in BigQuery)
- **raw** — exact supplier payload, append-only, partitioned by `ingested_at`. Audit + replay.
- **staging** — normalized to the canonical model (Dataform SQL), one model per supplier/standard.
- **quality** — per-record findings + per-supplier scores (Dataform assertions + rules table).
- **mart** — `mart.products`: only error-free, deduplicated, governed = the single source of truth.

---

## 3. Components

| Component | Responsibility | GCP service |
|---|---|---|
| Landing | Receive raw feeds (one prefix per supplier) | Cloud Storage + SFTP/API pull (Cloud Run jobs) |
| Ingestion adapters | Parse BMEcat / Promidata / CSV / Excel → load to `raw` | Cloud Run / Functions (Python) |
| Normalization | Map to canonical model, FX/units/category | Dataform (SQL) |
| Quality engine | Apply rules, score, emit findings | Dataform assertions + rules table |
| SoT builder | Promote error-free rows, dedupe, publish `mart.products` | Dataform |
| Versioning | Snapshot + diff per run | BigQuery partition snapshots |
| Orchestration | Schedule, retry, alert, SLAs | Cloud Composer (Airflow) |
| Supplier reporting | Render scorecards, email suppliers | Cloud Run + Looker Studio |
| Infra | All resources as code | Terraform |
| CI/CD | Test + deploy Dataform & DAGs | GitHub Actions |

### Configuration-driven onboarding
Each supplier = one declarative config (`config/suppliers/<id>.json`): `format`, `source`, currency,
and — for CSV/Excel — a `field_map`. Because **BMEcat and Promidata are standards**, a single adapter
each covers the majority of suppliers; adding one is config, not code (**G1**, NFR onboarding).

---

## 4. Data flow (per run)

```
for each supplier (parallel, one Airflow task each):
  1. pull feed → Cloud Storage (raw bytes kept)
  2. adapter parses → load into BigQuery raw.<supplier> (partition = run_id)
  3. Dataform: raw → staging (normalize)            [normalize.py in demo]
  4. Dataform assertions + rules → quality.findings  [quality.py in demo]
barrier:
  5. promote error-free rows → mart.products (dedupe by sku, last-good wins)
  6. snapshot mart.products → versions; compute diff vs previous run
  7. render per-supplier scorecards; email; refresh Looker dashboards
```

The demo's `run_pipeline.py` performs steps 1–7 sequentially in one process; in production each is an
Airflow task with retries, alerting and SLAs.

---

## 5. Key design decisions

- **Adapter-per-standard, not per-supplier.** Minimizes long-tail effort; new BMEcat/Promidata suppliers are free.
- **Raw is immutable.** Enables reprocessing when rules change, and full lineage (**G3**, auditability).
- **Quality is data, not logs.** Findings are stored & queryable → supplier scorecards & trend analysis (**G2**).
- **Errors block, warnings don't.** Only error-free rows reach the mart; warnings are published but reported.
- **Set-based transforms in SQL (Dataform).** Most Talend `tMap` logic is set-based and ports cleanly to SQL,
  is testable (assertions) and version-controlled — the migration target (**G5**).
- **Versioned mart.** Every run is snapshotted and diffed; "what changed and why" is always answerable.

---

## 6. Scaling & performance

- Ingestion is **embarrassingly parallel** per supplier (Airflow dynamic task mapping; Cloud Run autoscale).
- BigQuery handles the volume; tables **partitioned by run/date**, **clustered by `supplier`, `category`**.
- Diff via `EXCEPT DISTINCT` on hashed rows — set operation, scales to millions of rows.
- Cost control: serverless, partition pruning, materialize only the mart; raw on cheap storage with lifecycle TTL.

---

## 7. Talend migration plan

1. **Inventory** Talend jobs: sources, `tMap` rules, joins, quality logic, schedules.
2. **Re-express** transformation rules as Dataform models with assertions (set-based → SQL).
3. **Re-express** orchestration as Airflow DAGs in Composer.
4. **Parallel run** old + new; reconcile `mart.products` row-for-row (hash compare).
5. **Cut over** per data domain (e.g. pens first), decommission Talend job by job.

---

## 8. Reliability & observability

- Retries + exponential backoff per task; dead-letter for unparseable feeds.
- Schema-drift detection on ingest (new/renamed columns → warning + alert, not silent drop).
- Run manifest table: per run, per supplier — rows in/out, score, errors, duration.
- Alerting on: feed missing past SLA, score drop > X%, published count anomaly.

See also: [ALGORITHMS.md](ALGORITHMS.md) · [DATA_MODEL.md](DATA_MODEL.md) · [../GCP_PRODUCTION_MAPPING.md](../GCP_PRODUCTION_MAPPING.md)
