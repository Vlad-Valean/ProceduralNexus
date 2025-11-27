package com.proceduralnexus.apiservice.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class SwaggerUrlLogger implements ApplicationListener<ApplicationReadyEvent> {

    private static final Logger log = LoggerFactory.getLogger(SwaggerUrlLogger.class);

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        Environment environment = event.getApplicationContext().getEnvironment();
        String port = environment.getProperty("local.server.port");

        // The default URL you requested
        String swaggerUiUrl = String.format("http://localhost:%s/swagger-ui/index.html", port);
        String apiDocsUrl = String.format("http://localhost:%s/v3/api-docs", port);

        log.info("\n\n" +
                "----------------------------------------------------------\n\t" +
                "Application 'api-service' is running! Access URLs:\n\t" +
                "Swagger UI: \t{}\n\t" +
                "API Docs: \t{}\n" +
                "----------------------------------------------------------\n",
                swaggerUiUrl,
                apiDocsUrl);
    }
}