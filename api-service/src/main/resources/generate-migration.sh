#!/bin/bash

# A script to automate the generation of a new Flyway migration script.
# Usage (from api-service/src/main/resources): ./generate-migration.sh Your_Migration_Name

set -e # Exit immediately if a command exits with a non-zero status.

MIGRATION_NAME=$1

if [ -z "$MIGRATION_NAME" ]; then
  echo "Error: No migration name supplied."
  echo "Usage: ./generate-migration.sh Your_Migration_Name"
  exit 1
fi

# Adjust paths to be relative to the script's location inside api-service/src/main/resources
MIGRATION_DIR="./db/migration"
PROPERTIES_FILE="./application-generate-migration.properties"

# Find the latest version number by looking at the existing migration files.
LATEST_VERSION=$(ls -1 ${MIGRATION_DIR}/V*__*.sql 2>/dev/null | sed -e 's|.*/V||' -e 's/__.*//' | sort -n | tail -n 1 || true)

if [ -z "$LATEST_VERSION" ]; then
  # If no migrations exist yet, start with V1.
  NEXT_VERSION=1
else
  # Otherwise, increment the latest version.
  NEXT_VERSION=$((LATEST_VERSION + 1))
fi

echo "Latest migration version: ${LATEST_VERSION:-0}. Next version: ${NEXT_VERSION}"

NEW_FILENAME="V${NEXT_VERSION}__${MIGRATION_NAME}.sql"

echo "Updating properties to generate: ${NEW_FILENAME}"

# Use sed to update the target file in the properties file. This works on both Linux and macOS.
sed -i.bak "s|update-target=.*|update-target=src/main/resources/db/migration/${NEW_FILENAME}|" "$PROPERTIES_FILE"

echo "Running Spring Boot with 'generate-migration' profile to create the script..."

# Navigate to the api-service directory and run Maven. It will find the pom.xml automatically.
(cd ../../.. && mvn spring-boot:run "-Dspring-boot.run.profiles=generate-migration")

echo "Migration script '${NEW_FILENAME}' generated successfully in '${MIGRATION_DIR}'."