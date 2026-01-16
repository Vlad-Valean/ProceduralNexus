package com.proceduralnexus.documentanalysis.controller;

import com.proceduralnexus.documentanalysis.dto.QuestionDto;
import com.proceduralnexus.documentanalysis.service.DocumentProcessingService;
import org.springframework.ai.chat.ChatClient;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.SystemPromptTemplate;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.context.annotation.Lazy;
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
            You are a helpful AI assistant.
            
            Answer the user's question using ONLY the following context. If the answer is not in the context, say "I cannot answer this based on the provided document."
            
            Context:
            ---------------------
            {documents}
            ---------------------
            """;

    public DocumentAnalysisController(DocumentProcessingService documentProcessingService, @Lazy ChatClient chatClient, @Lazy VectorStore vectorStore) {
        this.documentProcessingService = documentProcessingService;
        this.chatClient = chatClient;
        this.vectorStore = vectorStore;
    }

    @PostMapping("/process/{documentId}")
    public Mono<ResponseEntity<String>> processDocument(@PathVariable Long documentId) {
        return documentProcessingService.fetchAndProcessDocument(documentId)
                .then(Mono.just(ResponseEntity.ok("Document processed successfully")))
                .onErrorResume(e -> {
                    e.printStackTrace();
                    return Mono.just(ResponseEntity.status(500).body("Error processing document: " + e.getMessage()));
                });
    }

    @PostMapping("/ask")
    public Mono<String> askQuestion(@RequestBody QuestionDto questionDto) {
        return Mono.fromCallable(() -> {
            System.out.println("DEBUG: Searching for similar documents for query: " + questionDto.question());
            List<Document> similarDocuments = vectorStore.similaritySearch(questionDto.question());
            System.out.println("DEBUG: Found " + similarDocuments.size() + " similar documents for query: " + questionDto.question());

            String documents = similarDocuments.stream()
                    .map(Document::getContent)
                    .collect(Collectors.joining("\n"));
            
            System.out.println("DEBUG: Total context length: " + documents.length());
            System.out.println("DEBUG: Context provided to AI (first 500 chars): " + documents.substring(0, Math.min(documents.length(), 500)) + (documents.length() > 500 ? "..." : ""));

            SystemPromptTemplate systemPromptTemplate = new SystemPromptTemplate(systemPrompt);
            Message systemMessage = systemPromptTemplate.createMessage(Map.of("documents", documents));
            Message userMessage = new UserMessage(questionDto.question());

            Prompt prompt = new Prompt(List.of(systemMessage, userMessage));
            
            return chatClient.call(prompt).getResult().getOutput().getContent();
        }).subscribeOn(Schedulers.boundedElastic());
    }
}
