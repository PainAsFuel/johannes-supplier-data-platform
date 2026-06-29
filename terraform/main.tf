# Illustrative Terraform for the production platform (not applied in the demo).
# Shows the intended infrastructure-as-code shape for the GCP environment.

terraform {
  required_providers {
    google = { source = "hashicorp/google", version = "~> 5.0" }
  }
}

variable "project_id" { type = string }
variable "region" { type = string, default = "europe-west3" } # Frankfurt

provider "google" {
  project = var.project_id
  region  = var.region
}

# --- Landing bucket: one prefix per supplier ---
resource "google_storage_bucket" "landing" {
  name                        = "${var.project_id}-supplier-landing"
  location                    = var.region
  uniform_bucket_level_access = true
  lifecycle_rule {
    condition { age = 90 }
    action { type = "Delete" }
  }
}

# --- Medallion datasets ---
resource "google_bigquery_dataset" "raw" {
  dataset_id  = "raw"
  location    = var.region
  description = "Append-only raw supplier feeds (audit trail)"
}

resource "google_bigquery_dataset" "staging" {
  dataset_id = "staging"
  location   = var.region
}

resource "google_bigquery_dataset" "mart" {
  dataset_id  = "mart"
  location    = var.region
  description = "Governed single source of truth (mart.products)"
}

# --- Cloud Composer (Airflow) environment ---
resource "google_composer_environment" "etl" {
  name   = "product-data-etl"
  region = var.region
  config {
    software_config {
      image_version = "composer-2-airflow-2"
    }
  }
}

# --- Service account for pipelines ---
resource "google_service_account" "pipeline" {
  account_id   = "product-data-pipeline"
  display_name = "Product Data Pipeline"
}
