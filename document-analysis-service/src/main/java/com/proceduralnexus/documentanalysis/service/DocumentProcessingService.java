package com.proceduralnexus.documentanalysis.service;

import com.proceduralnexus.documentanalysis.client.ApiClient;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;

@Service
public class DocumentProcessingService {

    private final VectorStore vectorStore;
    private final ApiClient apiClient;

    public DocumentProcessingService(@Lazy VectorStore vectorStore, ApiClient apiClient) {
        this.vectorStore = vectorStore;
        this.apiClient = apiClient;
    }

    public Mono<Void> fetchAndProcessDocument(Long documentId) {
        return apiClient.getDocument(documentId)
                .publishOn(Schedulers.boundedElastic())
                .flatMap(documentDto -> {
                    try {
                        processPdfDocument(new ByteArrayInputStream(documentDto.content()));
                        return Mono.empty();
                    } catch (IOException e) {
                        return Mono.error(e);
                    } catch (Exception e) {
                         return Mono.error(e);
                    }
                });
    }

    public void processPdfDocument(InputStream pdfInputStream) throws IOException {
        String textContent = extractTextFromPdf(pdfInputStream);
        System.out.println("DEBUG: Extracted text length: " + textContent.length());
        if (textContent.isBlank()) {
            System.err.println("DEBUG: WARNING - Extracted text is empty!");
        } else {
            System.out.println("DEBUG: First 100 chars: " + textContent.substring(0, Math.min(textContent.length(), 100)));
        }
        Document document = new Document(textContent, Collections.emptyMap());
        vectorStore.add(Collections.singletonList(document));
    }

    private String extractTextFromPdf(InputStream inputStream) throws IOException {
        byte[] pdfBytes = inputStream.readAllBytes();
        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            PDFTextStripper pdfStripper = new PDFTextStripper();
            return pdfStripper.getText(document);
        }
    }
}
