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
# We need to make sure we are replacing the correct line, or adding it if it doesn't exist.
# The previous regex was failing because the line in the file was 'update-target' but the script was looking for 'create-target'
# Also, Hibernate 6 uses 'create-target' for script generation when action is 'create' or 'drop-and-create',
# but for 'update' action it might behave differently or require different properties.
# However, the standard way to dump schema changes is often via 'create' action to a new file, but that dumps the WHOLE schema.
# To generate *diffs* (migrations), standard Hibernate schema generation isn't perfect.
# But assuming the user wants to dump the *create* script for the new entities or the full schema to manually diff:

# Let's stick to the user's previous working setup but fix the property name mismatch.
# The file had 'update-target', but the script was replacing 'create-target'.

$content = Get-Content -Path $PROPERTIES_FILE
$newContent = @()
$found = $false

foreach ($line in $content) {
    if ($line -match 'spring.jpa.properties.jakarta.persistence.schema-generation.scripts.create-target=.*') {
        $newContent += "spring.jpa.properties.jakarta.persistence.schema-generation.scripts.create-target=src/main/resources/db/migration/$newFilename"
        $found = $true
    }
    elseif ($line -match 'spring.jpa.properties.jakarta.persistence.schema-generation.scripts.update-target=.*') {
         # If we find update-target, we replace it with create-target because that's what the script logic seemed to intend
         # or we can keep it as update-target if that's what Hibernate expects for updates.
         # But the error "Writing to script was requested, but no script file was specified" suggests a missing property.
         # Let's set BOTH to be safe, or switch to 'create-target' which is more standard for script output.
         $newContent += "spring.jpa.properties.jakarta.persistence.schema-generation.scripts.create-target=src/main/resources/db/migration/$newFilename"
         $found = $true
    }
    else {
        $newContent += $line
    }
}

if (-not $found) {
    $newContent += "spring.jpa.properties.jakarta.persistence.schema-generation.scripts.create-target=src/main/resources/db/migration/$newFilename"
}

$newContent | Set-Content -Path $PROPERTIES_FILE

# Also ensure the action is set to 'create' or 'drop-and-create' to force script generation of the full schema
# OR 'update' if we trust Hibernate to generate diffs (which it often doesn't do well for scripts).
# The error "Writing to script was requested, but no script file was specified" usually happens when
# 'javax.persistence.schema-generation.scripts.action' is set but the target file property is missing.
# In Hibernate 6 / Jakarta Persistence 3, the properties are:
# jakarta.persistence.schema-generation.scripts.action
# jakarta.persistence.schema-generation.scripts.create-target
# jakarta.persistence.schema-generation.scripts.drop-target

Write-Host "Running Spring Boot with 'generate-migration' profile to create the script..."

# Navigate directly into the 'api-service' directory to run Maven.
try {
    Push-Location (Join-Path -Path $ScriptDir -ChildPath "..\..\..") # Go up 3 levels to the api-service dir
    # Enclose the -D argument in quotes to ensure it's passed as a single string
    mvn spring-boot:run "-Dspring-boot.run.profiles=generate-migration"
}
finally { Pop-Location }

Write-Host "Migration script '$newFilename' generated successfully in '$MIGRATION_DIR'."