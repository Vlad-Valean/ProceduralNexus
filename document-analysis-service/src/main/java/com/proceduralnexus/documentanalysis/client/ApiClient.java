package com.proceduralnexus.documentanalysis.client;

import com.proceduralnexus.documentanalysis.dto.DocumentDto;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class ApiClient {

    private final WebClient webClient;

    public ApiClient(WebClient webClient) {
        this.webClient = webClient;
    }

    public Mono<DocumentDto> getDocument(Long documentId) {
        return webClient.get()
                .uri("/documents/{id}/download", documentId)
                .retrieve()
                .bodyToMono(DocumentDto.class);
    }
}
