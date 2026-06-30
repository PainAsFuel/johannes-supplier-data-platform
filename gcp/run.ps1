# One-shot: provision (Terraform) -> load (BigQuery) -> transform (Dataform SQL) -> export (dashboard).
# Usage:  pwsh gcp/run.ps1 -ProjectId your-project-id
param([Parameter(Mandatory = $true)][string]$ProjectId)

$ErrorActionPreference = "Stop"
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + [System.Environment]::GetEnvironmentVariable("Path","Machine")
$repo = Split-Path $PSScriptRoot -Parent
Set-Location $repo

Write-Host "== 0. set project =="
gcloud config set project $ProjectId | Out-Null

Write-Host "== 1. Terraform: provision BigQuery datasets =="
Push-Location gcp/terraform
terraform init -input=false | Out-Null
terraform apply -auto-approve -var "project_id=$ProjectId"
Pop-Location

Write-Host "== 2. Load real supplier data into BigQuery (staging.products) =="
python gcp/gcp_pipeline.py load $ProjectId

Write-Host "== 3. Dataform: compile (validate) the project =="
(Get-Content gcp/dataform/workflow_settings.yaml) -replace '__PROJECT_ID__', $ProjectId | Set-Content gcp/dataform/workflow_settings.yaml -Encoding utf8
try { npx -y @dataform/cli@latest compile gcp/dataform 2>&1 | Select-Object -Last 5 } catch { Write-Host "  (dataform CLI compile skipped: $_)" }

Write-Host "== 4. Run Dataform models in BigQuery (quality.* + mart.products) =="
python gcp/run_models.py $ProjectId

Write-Host "== 5. Export BigQuery results -> docs/data.js =="
python gcp/gcp_pipeline.py export $ProjectId

Write-Host "`nDone. The dashboard now reflects real BigQuery output." -ForegroundColor Green
