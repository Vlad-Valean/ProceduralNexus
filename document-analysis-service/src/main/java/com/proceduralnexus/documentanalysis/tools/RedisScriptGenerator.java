package com.proceduralnexus.documentanalysis.tools;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * An "intelligent" tool to generate a comprehensive Redis migration script.
 * It scans all entities in the domain package and generates 'DROP' and 'CREATE'
 * commands for their search indexes, ensuring they are always in sync with the code.
 *
 * To run this from your IDE, edit the 'Run Configuration' and provide one argument
 * in the 'Program arguments' field, for example:
 * rebuild_all_domain_indexes
 */
public class RedisScriptGenerator {

    private static final String DOMAIN_PACKAGE_NAME = "com.proceduralnexus.documentanalysis.domain";
    private static final String REDIS_CONTAINER_NAME = "proceduralnexus-redis-stack-1"; // From docker-compose.infra.yml

    public static void main(String[] args) throws IOException, ClassNotFoundException {
        if (args.length < 1) {
            System.err.println("FATAL: Missing arguments.");
            System.err.println("Usage: java RedisScriptGenerator <migration_name>");
            System.err.println("Example: java RedisScriptGenerator rebuild_all_domain_indexes");
            return;
        }

        String migrationName = args[0];
        System.out.printf("Starting Redis script generation for migration='%s'\n", migrationName);

        Path moduleRoot = findModuleRoot();
        if (moduleRoot == null) {
            System.err.println("FATAL: Could not find the 'document-analysis-service' module directory.");
            return;
        }
        System.out.println("Detected module root: " + moduleRoot);

        List<Class<?>> domainClasses = findDomainClasses(moduleRoot);
        if (domainClasses.isEmpty()) {
            System.err.println("FATAL: No classes found in package " + DOMAIN_PACKAGE_NAME);
            return;
        }

        System.out.println("Found domain classes to index: " + domainClasses.stream().map(Class::getSimpleName).collect(Collectors.joining(", ")));

        Path shScriptDir = moduleRoot.resolve("src/main/resources/redis/scripts/sh");
        Path ps1ScriptDir = moduleRoot.resolve("src/main/resources/redis/scripts/ps1");
        Files.createDirectories(shScriptDir);
        Files.createDirectories(ps1ScriptDir);

        int nextVersion = findNextVersion(shScriptDir, ps1ScriptDir);
        System.out.println("Next migration version: " + nextVersion);

        String allRedisCommands = domainClasses.stream()
            .map(RedisScriptGenerator::generateFtCommandsForClass)
            .collect(Collectors.joining("\n"));

        generateScripts(nextVersion, migrationName, allRedisCommands, shScriptDir, ps1ScriptDir);

        System.out.println("\nScript generation finished successfully.");
        System.out.println("IMPORTANT: To run the migration, execute the .sh or .ps1 script from your terminal.");
    }

    private static List<Class<?>> findDomainClasses(Path moduleRoot) throws IOException, ClassNotFoundException {
        List<Class<?>> classes = new ArrayList<>();
        Path packagePath = moduleRoot.resolve("src/main/java").resolve(DOMAIN_PACKAGE_NAME.replace('.', '/'));

        try (var files = Files.walk(packagePath)) {
            List<String> classNames = files
                .filter(p -> p.toString().endsWith(".java"))
                .map(p -> DOMAIN_PACKAGE_NAME + "." + p.getFileName().toString().replace(".java", ""))
                .collect(Collectors.toList());

            for (String className : classNames) {
                classes.add(Class.forName(className));
            }
        }
        return classes;
    }

    private static String generateFtCommandsForClass(Class<?> entityClass) {
        String indexName = "idx:" + entityClass.getSimpleName().toLowerCase();
        String keyPrefix = entityClass.getSimpleName().toLowerCase().replace("entry", "") + ":";
        StringBuilder schema = new StringBuilder();

        for (Field field : entityClass.getDeclaredFields()) {
            String fieldName = field.getName();
            if (fieldName.equalsIgnoreCase("embedding")) {
                schema.append(String.format(" $.%s AS %s VECTOR FLAT 6 TYPE FLOAT32 DIM 1536 DISTANCE_METRIC COSINE", fieldName, fieldName));
            } else if (List.class.isAssignableFrom(field.getType())) {
                // Skip lists
            } else if (field.getType().isPrimitive() || field.getType().equals(String.class)) {
                schema.append(String.format(" $.%s AS %s TEXT", fieldName, fieldName));
            } else if (!field.getType().isPrimitive() && !field.getType().getPackage().getName().startsWith("java")) {
                for (Field subField : field.getType().getDeclaredFields()) {
                    schema.append(String.format(" $.%s.%s AS %s_%s TEXT", fieldName, subField.getName(), fieldName, subField.getName()));
                }
            }
        }

        String createCommand = String.format("FT.CREATE %s ON JSON PREFIX 1 %s SCHEMA %s", indexName, keyPrefix, schema.toString().trim());
        String dropCommand = String.format("FT.DROPINDEX %s", indexName);

        // Return a command that safely drops the index before creating it.
        return String.format("redis-cli %s\nredis-cli %s", dropCommand, createCommand);
    }

    private static void generateScripts(int version, String name, String allCommands, Path shDir, Path ps1Dir) throws IOException {
        String shFilename = String.format("V%d__%s.sh", version, name);
        String ps1Filename = String.format("V%d__%s.ps1", version, name);

        String shScriptContent = String.format(
            "#!/bin/bash\n# Auto-generated Redis migration script\n\necho \"Executing migration: %s\"\n\ndocker exec %s bash -c '\n%s\n'\n\necho \"Migration completed.\"\n",
            shFilename, REDIS_CONTAINER_NAME, allCommands.replace("redis-cli", "")
        );
        Path shPath = shDir.resolve(shFilename);
        Files.write(shPath, shScriptContent.getBytes());
        shPath.toFile().setExecutable(true);
        System.out.println("Generated Bash script: " + shPath);

        String ps1ScriptContent = String.format(
            "# Auto-generated Redis migration script\n\nWrite-Host \"Executing migration: %s\"\n\n%s\n\nWrite-Host \"Migration completed.\"\n",
            ps1Filename, allCommands.replace("redis-cli", String.format("docker exec %s redis-cli", REDIS_CONTAINER_NAME))
        );
        Path ps1Path = ps1Dir.resolve(ps1Filename);
        Files.write(ps1Path, ps1ScriptContent.getBytes());
        System.out.println("Generated PowerShell script: " + ps1Path);
    }

    private static int findNextVersion(Path... scriptDirs) {
        int latestVersion = 0;
        for (Path dir : scriptDirs) {
            if (!Files.isDirectory(dir)) continue;
            try (var paths = Files.walk(dir)) {
                int maxInDir = paths
                    .map(path -> path.getFileName().toString())
                    .filter(name -> name.matches("^V(\\d+)__.*"))
                    .map(name -> Integer.parseInt(name.replaceAll("^V(\\d+)__.*", "$1")))
                    .max(Integer::compareTo)
                    .orElse(0);
                if (maxInDir > latestVersion) {
                    latestVersion = maxInDir;
                }
            } catch (IOException e) {
                System.err.println("Warning: Could not scan directory " + dir + " for versions.");
            }
        }
        return latestVersion + 1;
    }
    
    private static Path findModuleRoot() {
        Path currentPath = Paths.get(".").toAbsolutePath().normalize();
        if (currentPath.getFileName().toString().equals("document-analysis-service")) {
            return currentPath;
        }
        Path potentialModulePath = currentPath.resolve("document-analysis-service");
        if (Files.isDirectory(potentialModulePath)) {
            return potentialModulePath;
        }
        return null;
    }
}
