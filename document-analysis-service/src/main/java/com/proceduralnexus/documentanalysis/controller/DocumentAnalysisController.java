package com.proceduralnexus.documentanalysis.controller;

import com.proceduralnexus.documentanalysis.dto.QuestionDto;
import com.proceduralnexus.documentanalysis.service.DocumentProcessingService;
import org.springframework.ai.chat.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.SystemPromptTemplate;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/analysis")
public class DocumentAnalysisController {

    private final DocumentProcessingService documentProcessingService;
    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    private final String systemPrompt = """
            You are a helpful AI assistant that answers questions based on the provided documents.
            
            The user has provided the following documents:
            {documents}
            """;

    public DocumentAnalysisController(DocumentProcessingService documentProcessingService, ChatClient chatClient, VectorStore vectorStore) {
        this.documentProcessingService = documentProcessingService;
        this.chatClient = chatClient;
        this.vectorStore = vectorStore;
    }

    @PostMapping("/process/{documentId}")
    public Mono<ResponseEntity<Void>> processDocument(@PathVariable Long documentId) {
        return documentProcessingService.fetchAndProcessDocument(documentId)
                .then(Mono.just(ResponseEntity.ok().<Void>build()))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(500).build()));
    }

    @PostMapping("/ask")
    public Mono<String> askQuestion(@RequestBody QuestionDto questionDto) {
        return Mono.fromCallable(() -> {
            List<Document> similarDocuments = vectorStore.similaritySearch(questionDto.question());
            String documents = similarDocuments.stream()
                    .map(Document::getContent)
                    .collect(Collectors.joining("\n"));

            SystemPromptTemplate systemPromptTemplate = new SystemPromptTemplate(systemPrompt);
            Prompt prompt = systemPromptTemplate.create(Map.of("documents", documents));
            
            return chatClient.call(prompt).getResult().getOutput().getContent();
        }).subscribeOn(Schedulers.boundedElastic());
    }
}
