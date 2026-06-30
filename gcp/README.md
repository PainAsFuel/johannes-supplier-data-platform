# Real GCP run (BigQuery · Dataform · Terraform)

This folder makes the pipeline run on **actual Google Cloud**, on a **free BigQuery sandbox**
(no billing / no credit card). The dashboard's `docs/data.js` is then produced from real
BigQuery output.

What runs for real:
- **Terraform** provisions the `raw / staging / quality / mart` BigQuery datasets (`gcp/terraform/`).
- **BigQuery** holds the data and runs all transforms & quality checks as SQL.
- **Dataform** project (`gcp/dataform/`) defines the transforms + assertions; executed against BigQuery.

Not on the free path (need billing): Cloud Storage, Cloud Composer, Cloud Run — kept as IaC/illustrative.

## Prerequisites (one-time)
1. A **BigQuery sandbox** project — sign in at https://console.cloud.google.com/bigquery (no card needed).
2. Authenticate:
   ```
   gcloud auth login
   gcloud auth application-default login
   ```

## Run
```
pwsh gcp/run.ps1 -ProjectId YOUR_PROJECT_ID
```
This provisions datasets, loads the real supplier data, builds the Dataform models in BigQuery,
runs the assertions, and regenerates `docs/data.js` from the BigQuery `mart.products` /
`quality.*` tables.

## Pieces
| File | Purpose |
|---|---|
| `terraform/main.tf` | BigQuery datasets as code |
| `dataform/definitions/*.sqlx` | quality findings, annotated products, supplier scores, mart (with assertions) |
| `gcp_pipeline.py` | `load` (ingest+normalize → BigQuery staging) and `export` (BigQuery → dashboard) |
| `run_models.py` | executes the Dataform SQL models in dependency order via `bq` |
| `run.ps1` | orchestrates the whole run |
