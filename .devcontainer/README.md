
# Dev Container for ProceduralNexus

This devcontainer sets up Java 17, Maven, Node.js, and common tools for developing all services in VS Code. It uses Docker Compose to run all backend and frontend services automatically.

## Services (from docker-compose.yml)

**db**: PostgreSQL 16
	- Port: 5432
	- Env: POSTGRES_DB=procedural_nexus_db, POSTGRES_USER=user, POSTGRES_PASSWORD=password
	- Volume: db_data

**pgadmin**: pgAdmin4
	- Port: 5050 (web UI)
	- Env: PGADMIN_DEFAULT_EMAIL=admin@example.com, PGADMIN_DEFAULT_PASSWORD=admin

**redis-stack**: Redis Stack
	- Ports: 6379 (Redis), 8001 (Web UI)

**api-service**: Spring Boot API
	- Port: 8080
	- Depends on: db
	- Env: SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME, SPRING_DATASOURCE_PASSWORD, SPRING_JPA_HIBERNATE_DDL_AUTO

**document-analysis-service**: Spring Boot Service
	- Port: 8081
	- Depends on: redis-stack
	- Env: SPRING_DATA_REDIS_HOST, SPRING_DATA_REDIS_PORT, SERVER_PORT

**webapp**: Vite/React Frontend
	- Port: 80
	- Depends on: api-service, document-analysis-service

## Usage

1. Open the folder in VS Code and reopen in container when prompted.
2. All dependencies are installed automatically.
3. All services are started automatically using Docker Compose.
4. Access services via forwarded ports:
	 - API: http://localhost:8080
	 - Document Analysis: http://localhost:8081
	 - Webapp: http://localhost:80
	 - pgAdmin: http://localhost:5050
	 - Redis UI: http://localhost:8001


## Customization

- Edit `docker-compose.yml` to change service configuration, environment variables, or ports.
- Add more VS Code extensions in `.devcontainer/devcontainer.json` as needed.
