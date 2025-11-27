#!/bin/bash
echo "Starting infrastructure services (Postgres, pgAdmin, Redis)..."
docker compose -f docker-compose.infra.yml up -d --wait

echo "Starting application services..."
docker compose -f docker-compose.app.yml up -d --build