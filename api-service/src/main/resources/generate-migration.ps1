# A script to automate the generation of a new Flyway migration script.
# Usage (from api-service/src/main/resources): ./generate-migration.ps1 Your_Migration_Name

param(
    [string]$MigrationName
)

# Stop script on any error
$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrEmpty($MigrationName)) {
    Write-Error "No migration name supplied."
    Write-Host "Usage: ./generate-migration.ps1 Your_Migration_Name"
    exit 1
}

# Get the directory of the current script
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Define paths relative to the script's location
$MIGRATION_DIR = Join-Path -Path $ScriptDir -ChildPath "db/migration"
$PROPERTIES_FILE = Join-Path -Path $ScriptDir -ChildPath "application-generate-migration.properties"

# Find the latest version number
$latestVersion = 0
$migrationFiles = Get-ChildItem -Path $MIGRATION_DIR -Filter "V*__*.sql" -ErrorAction SilentlyContinue
if ($migrationFiles) {
    $latestVersion = $migrationFiles | ForEach-Object {
        if ($_.BaseName -match '^V(\d+)__') {
            [int]$matches[1]
        }
    } | Measure-Object -Maximum | Select-Object -ExpandProperty Maximum
}

$nextVersion = $latestVersion + 1

Write-Host "Latest migration version: $latestVersion. Next version: $nextVersion"

$newFilename = "V${nextVersion}__${MigrationName}.sql"

Write-Host "Updating properties to generate: $newFilename"

# Update the properties file with the correct 'create-target' property
(Get-Content -Path $PROPERTIES_FILE) | ForEach-Object {
    $_ -replace 'spring.jpa.properties.jakarta.persistence.schema-generation.scripts.create-target=.*', "spring.jpa.properties.jakarta.persistence.schema-generation.scripts.create-target=src/main/resources/db/migration/$newFilename"
} | Set-Content -Path $PROPERTIES_FILE

Write-Host "Running Spring Boot with 'generate-migration' profile to create the script..."

# Navigate directly into the 'api-service' directory to run Maven.
try {
    Push-Location (Join-Path -Path $ScriptDir -ChildPath "..\..\..") # Go up 3 levels to the api-service dir
    # Enclose the -D argument in quotes to ensure it's passed as a single string
    mvn spring-boot:run "-Dspring-boot.run.profiles=generate-migration"
}
finally { Pop-Location }

Write-Host "Migration script '$newFilename' generated successfully in '$MIGRATION_DIR'."