package com.proceduralnexus.documentanalysis.domain;

import java.util.List;

public class SemanticCacheEntry {
    private String original_query;
    private String response;
    private List<Double> embedding;

    // Getters and Setters

    public String getOriginal_query() {
        return original_query;
    }

    public void setOriginal_query(String original_query) {
        this.original_query = original_query;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public List<Double> getEmbedding() {
        return embedding;
    }

    public void setEmbedding(List<Double> embedding) {
        this.embedding = embedding;
    }
}
