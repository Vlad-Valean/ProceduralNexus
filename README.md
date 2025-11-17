gi# ProceduralNexus

## 1. Project Overview

**ProceduralNexus** is a comprehensive platform designed to streamline document management and analysis. It leverages a microservices architecture to provide a scalable and resilient system. The platform allows users to upload, store, and manage documents, while also offering powerful AI-driven analysis to extract insights and automate workflows.

## 2. Project Structure

The project is organized into several key directories:

-   `api-service/`: The core backend service that handles business logic, user authentication, and data persistence. It is a Spring Boot application.
-   `document-analysis-service/`: A specialized microservice for handling document processing and AI-based analysis. It is also a Spring Boot application that interacts with Redis for caching and task management.
-   `webapp/`: The frontend application built with React and Vite, providing the user interface for interacting with the platform.
-   `database/`: Contains database-related scripts and configurations. The project uses PostgreSQL.
-   `docs/`: For documentation.
-   `docker-compose.yml`: Defines and configures the services for local development, including the database, pgAdmin, and Redis.

## 3. Project Setup

To get the project running locally, you need Docker and Docker Compose installed. The following command will start all the necessary services (database, Redis, etc.).

```bash
docker-compose up -d
```

## 4. Project Maintenance

This section covers common maintenance tasks.

### Backend Services (`api-service` and `document-analysis-service`)

To clean the Maven projects:

```bash
# Navigate to the service directory
cd api-service 
# or 
cd document-analysis-service

# Run the clean command
./mvnw clean
```

### Frontend Service (`webapp`)

To update dependencies for the web application:

```bash
# Navigate to the webapp directory
cd webapp

# Install or update dependencies
npm install
```

## 5. Project Development

For active development, you can run each service individually.

### Backend Services

To run the `api-service` or `document-analysis-service` in development mode, navigate to its root directory and use the Spring Boot Maven plugin:

```bash
# Navigate to the service directory
cd api-service
# or
cd document-analysis-service

# Run the application
./mvnw spring-boot:run
```

### Frontend Service

To run the `webapp` in development mode with hot-reloading:

```bash
# Navigate to the webapp directory
cd webapp

# Start the development server
npm run dev
```

This will start the frontend application, typically on `http://localhost:80`.

## 6. Using the Dev Container

To use the Dev Container for ProceduralNexus development:

1. **Open the project in VS Code.**
2. If prompted, click "Reopen in Container" or use the command palette (`Ctrl+Shift+P`) and select `Dev Containers: Reopen in Container`.
3. Wait for the container to build and initialize (all dependencies are installed automatically).
4. All services (backend, frontend, database, Redis) are started via Docker Compose.
5. Access the services via forwarded ports:
    - API: http://localhost:8080
    - Document Analysis: http://localhost:8081
    - Webapp: http://localhost:80
    - pgAdmin: http://localhost:5050
    - Redis UI: http://localhost:8001

You can customize the devcontainer by editing files in `.devcontainer/`.
