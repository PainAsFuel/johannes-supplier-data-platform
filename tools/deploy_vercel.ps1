# Deploy the static dashboard (docs/) to Vercel as project "source-data-platform".
# The repo root contains Python, which Vercel mis-detects as a Python app, so we
# deploy a clean copy of docs/ from a temp folder named after the project.
#
# Usage:  $env:VERCEL_TOKEN="..."; pwsh tools/deploy_vercel.ps1
param([string]$Scope = "painasfuels-projects")

$ErrorActionPreference = "Stop"
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + [System.Environment]::GetEnvironmentVariable("Path","Machine")
$repo = Split-Path $PSScriptRoot -Parent
$dep = Join-Path $env:TEMP "source-data-platform"

if (Test-Path $dep) { Remove-Item -Recurse -Force $dep }
New-Item -ItemType Directory -Path $dep | Out-Null
Copy-Item (Join-Path $repo "docs\*") -Destination $dep -Recurse
[IO.File]::WriteAllText((Join-Path $dep "vercel.json"),
  '{"cleanUrls": true, "trailingSlash": false}', (New-Object System.Text.UTF8Encoding($false)))

Set-Location $dep
vercel deploy --prod --yes --scope $Scope
Write-Host "`nDeployed to https://source-data-platform.vercel.app" -ForegroundColor Green
