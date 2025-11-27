# This script starts all services for the ProceduralNexus application.
# It first starts the infrastructure and then the application services.

Write-Host "Starting infrastructure services (Postgres, pgAdmin, Redis)..."
docker compose -f docker-compose.infra.yml up -d --wait

Write-Host "Starting application services..."
docker compose -f docker-compose.app.yml up -d --build

Write-Host "✅ All services are starting up."