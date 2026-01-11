# Universal PowerShell script to clean, install, build, and run everything for ProceduralNexus

Write-Host "Stopping and removing all Docker containers and volumes..."
docker compose -f docker-compose.infra.yml down --volumes

docker compose -f docker-compose.app.yml down --volumes

Write-Host "Cleaning backend Maven projects..."
cd api-service
./mvnw clean
cd ..
cd document-analysis-service
./mvnw clean
cd ..

Write-Host "Installing frontend dependencies..."
cd webapp
npm install
cd ..

Write-Host "Building Docker images (infra & app)..."
docker compose -f docker-compose.infra.yml build --no-cache

docker compose -f docker-compose.app.yml build --no-cache

Write-Host "Starting all services (infra & app)..."
docker compose -f docker-compose.infra.yml up -d --wait

docker compose -f docker-compose.app.yml up -d --build

Write-Host "✅ All Docker services are up and running!"

# Start backend api-service in dev mode
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd api-service; ./mvnw spring-boot:run'
Write-Host "Started api-service in development mode."

# Start backend document-analysis-service in dev mode
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd document-analysis-service; ./mvnw spring-boot:run'
Write-Host "Started document-analysis-service in development mode."

# Start frontend webapp in dev mode
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd webapp; npm run dev'
Write-Host "Started webapp in development mode."
