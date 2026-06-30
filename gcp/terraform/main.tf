# Real Terraform — provisions the BigQuery medallion datasets for the SOURCE
# product-data platform. Works on a free BigQuery sandbox (no billing needed for
# BigQuery datasets). Apply:  terraform init && terraform apply -var project_id=YOUR_PROJECT

terraform {
  required_version = ">= 1.5"
  required_providers {
    google = { source = "hashicorp/google", version = "~> 6.0" }
  }
}

variable "project_id" { type = string }
variable "location" {
  type    = string
  default = "EU"
}

provider "google" {
  project = var.project_id
}

locals {
  datasets = {
    raw     = "Exact supplier payloads (audit trail)"
    staging = "Normalized to the canonical product model"
    quality = "Data-quality findings and per-supplier scores"
    mart    = "Governed single source of truth (mart.products)"
  }
}

resource "google_bigquery_dataset" "ds" {
  for_each      = local.datasets
  dataset_id    = each.key
  friendly_name = "SOURCE ${each.key}"
  description   = each.value
  location      = var.location
}

output "datasets" {
  value = [for d in google_bigquery_dataset.ds : d.dataset_id]
}
