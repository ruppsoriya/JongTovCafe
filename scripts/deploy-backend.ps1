param(
    [string]$RenderServiceId = $env:RENDER_SERVICE_ID,
    [string]$RenderApiKey = $env:RENDER_API_KEY
)

$missing = @()
if ([string]::IsNullOrWhiteSpace($RenderServiceId)) { $missing += 'RENDER_SERVICE_ID or -RenderServiceId' }
if ([string]::IsNullOrWhiteSpace($RenderApiKey)) { $missing += 'RENDER_API_KEY or -RenderApiKey' }

if ($missing.Count -gt 0) {
    Write-Host "Missing required value(s): $($missing -join ', ')" -ForegroundColor Red
    Write-Host "Example:" -ForegroundColor Yellow
    Write-Host "  ./scripts/deploy-backend.ps1 -RenderServiceId 'srv-xxxxx' -RenderApiKey 'rnd_xxxxx'"
    exit 1
}

if (-not $RenderServiceId.StartsWith('srv-')) {
    Write-Host "Warning: Render service ID usually starts with 'srv-' (current: $RenderServiceId)" -ForegroundColor Yellow
}

Write-Host "Triggering deploy for Render service $RenderServiceId"

$headers = @(
    '-H', 'Accept: application/json',
    '-H', "Authorization: Bearer $RenderApiKey",
    '-H', 'Content-Type: application/json'
)

curl.exe -sS -X POST "https://api.render.com/v1/services/$RenderServiceId/deploys" @headers -d "{}"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Render deploy request failed." -ForegroundColor Red
    exit $LASTEXITCODE
}
