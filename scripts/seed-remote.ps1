param(
  [Parameter(Mandatory=$false)]
  [string]$DatabaseUrl
)

if (-not $DatabaseUrl) {
  Write-Host "Usage: .\\seed-remote.ps1 -DatabaseUrl 'postgres://user:pass@host:port/dbname'"
  exit 1
}

Write-Host "Using DATABASE_URL=$DatabaseUrl"
$env:DATABASE_URL = $DatabaseUrl

Push-Location backend
npm ci
Write-Host "Seeding database..."
npm run seed
Pop-Location
