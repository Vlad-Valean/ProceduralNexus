Write-Host "Rebuilding document-analysis-service..."
docker compose -f docker-compose.infra.yml -f docker-compose.app.yml up -d --build document-analysis-service

Write-Host "Waiting 15 seconds for service to start..."
Start-Sleep -Seconds 15

Write-Host "Running test-flow..."
./test-flow.ps1

Write-Host "`nFetching recent logs from document-analysis-service..."
docker compose -f docker-compose.infra.yml -f docker-compose.app.yml logs document-analysis-service --tail 100
