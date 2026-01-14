package com.proceduralnexus.apiservice.controller.dtos;

public class LogRequest {
    private String action;
    private String description;

    public LogRequest() {}

    public LogRequest(String action, String description) {
        this.action = action;
        this.description = description;
    }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
