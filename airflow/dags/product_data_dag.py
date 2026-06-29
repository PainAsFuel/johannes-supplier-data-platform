"""Illustrative Cloud Composer (Airflow) DAG (not run in the demo).

Mirrors run_pipeline.py: one task per stage, with retries and alerting.
In production each supplier's ingest is a dynamically-mapped task, and the
transform step triggers a Dataform run.
"""
from datetime import datetime, timedelta

from airflow import DAG
from airflow.operators.python import PythonOperator

SUPPLIERS = ["uma", "halfar", "mbw", "reflects"]  # loaded from a config table

default_args = {
    "owner": "data-eng",
    "retries": 3,
    "retry_delay": timedelta(minutes=5),
    "email_on_failure": True,
}

with DAG(
    dag_id="product_data_platform",
    schedule="0 4 * * *",          # daily 04:00
    start_date=datetime(2026, 1, 1),
    catchup=False,
    default_args=default_args,
    tags=["product-data", "etl"],
) as dag:

    def ingest_supplier(supplier_id: str):
        ...  # GCS -> BigQuery raw.<supplier>

    def run_dataform():
        ...  # trigger Dataform: staging models + assertions

    def publish_source_of_truth():
        ...  # build mart.products + snapshot + diff

    def email_quality_reports():
        ...  # render per-supplier scorecards, email each supplier

    ingests = [
        PythonOperator(task_id=f"ingest_{s}", python_callable=ingest_supplier, op_args=[s])
        for s in SUPPLIERS
    ]
    transform = PythonOperator(task_id="dataform_transform", python_callable=run_dataform)
    publish = PythonOperator(task_id="publish_sot", python_callable=publish_source_of_truth)
    report = PythonOperator(task_id="email_quality_reports", python_callable=email_quality_reports)

    ingests >> transform >> publish >> report
