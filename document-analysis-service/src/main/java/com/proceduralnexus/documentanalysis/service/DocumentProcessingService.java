package com.proceduralnexus.documentanalysis.service;

import com.proceduralnexus.documentanalysis.client.ApiClient;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;

@Service
public class DocumentProcessingService {

    private final VectorStore vectorStore;
    private final ApiClient apiClient;

    public DocumentProcessingService(VectorStore vectorStore, ApiClient apiClient) {
        this.vectorStore = vectorStore;
        this.apiClient = apiClient;
    }

    public Mono<Void> fetchAndProcessDocument(Long documentId) {
        return apiClient.getDocument(documentId)
                .flatMap(documentDto -> {
                    try {
                        processPdfDocument(new ByteArrayInputStream(documentDto.content()));
                        return Mono.empty();
                    } catch (IOException e) {
                        return Mono.error(e);
                    }
                });
    }

    public void processPdfDocument(InputStream pdfInputStream) throws IOException {
        String textContent = extractTextFromPdf(pdfInputStream);
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
