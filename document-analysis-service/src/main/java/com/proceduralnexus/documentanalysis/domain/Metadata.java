package com.proceduralnexus.documentanalysis.domain;

public class Metadata {
    private String source;
    private int page;
    private long created_at;

    // Getters and Setters

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public long getCreated_at() {
        return created_at;
    }

    public void setCreated_at(long created_at) {
        this.created_at = created_at;
    }
}
