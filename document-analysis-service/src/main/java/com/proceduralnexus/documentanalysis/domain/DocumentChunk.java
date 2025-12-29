package com.proceduralnexus.documentanalysis.domain;

import java.util.List;

public class DocumentChunk {
    private String doc_id;
    private String chunk_id;
    private String content;
    private Metadata metadata;
    private List<Double> embedding;

    // Getters and Setters

    public String getDoc_id() {
        return doc_id;
    }

    public void setDoc_id(String doc_id) {
        this.doc_id = doc_id;
    }

    public String getChunk_id() {
        return chunk_id;
    }

    public void setChunk_id(String chunk_id) {
        this.chunk_id = chunk_id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Metadata getMetadata() {
        return metadata;
    }

    public void setMetadata(Metadata metadata) {
        this.metadata = metadata;
    }

    public List<Double> getEmbedding() {
        return embedding;
    }

    public void setEmbedding(List<Double> embedding) {
        this.embedding = embedding;
    }
}
