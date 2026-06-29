# From this demo to the production GCP platform

This demo runs locally so it is easy to inspect, but it is structured so every
component has a direct, 1:1 production counterpart on Google Cloud. Nothing here
would be thrown away — the local pieces become thin wrappers around managed services.

| Demo component | Production on GCP |
|---|---|
| `data/incoming/` files | **Cloud Storage** landing bucket (one prefix per supplier), feeds arrive via SFTP/API pulls |
| `src/ingest.py` | Cloud Functions / Cloud Run ingestion jobs, or Airflow operators; API pulls with retry/backoff |
| `warehouse/raw/` | **BigQuery `raw_*`** datasets — append-only, partitioned by ingest date (full audit trail) |
| `src/normalize.py` + `config/` | **Dataform** SQL models (`staging`), driven by per-supplier mapping tables |
| `src/quality.py` rules | **Dataform assertions** + a `quality_findings` table; supplier scorecards as a BI view |
| `warehouse/transformed/products_current.json` | **BigQuery `mart.products`** — the governed single source of truth |
| `warehouse/versions/` + diff | BigQuery **time-travel / snapshot tables**, partitioned; diffs via `EXCEPT DISTINCT` |
| `run_pipeline.py` | A **Cloud Composer (Airflow) DAG** — one task per stage, with retries, SLAs, alerting |
| per-supplier HTML report | Scheduled export → **Looker Studio** dashboard + automated email/PDF to each supplier |
| (all infra) | **Terraform** — datasets, buckets, service accounts, Composer env, IAM as code |

## Why this shape
- **Config-driven onboarding.** New supplier = one mapping row/file. The brief's "50+ and growing"
  requirement is solved by never touching pipeline code to add a supplier.
- **Separation of raw / staged / mart (medallion).** Raw is immutable for audit and reprocessing;
  the mart is the clean contract other systems consume.
- **Quality is a first-class output, not a log.** Findings are stored, scored, and turned into
  supplier-facing reports — which is exactly what the client asked for.
- **Versioning = trust.** Every published state is reproducible and diffable, so "what changed and
  why" is always answerable.

## Talend migration approach
1. Inventory existing Talend jobs: sources, transformation rules, joins, quality logic, schedules.
2. Re-express transformation rules as Dataform SQL models (most Talend tMap logic is set-based and
   maps cleanly to SQL) — kept modular and version-controlled.
3. Re-express orchestration as Airflow DAGs in Composer.
4. Run old and new in parallel, reconcile outputs row-for-row, then cut over per data domain.
