package com.proceduralnexus.apiservice.controller.dtos;

public class AdminLogDto {
    public Long id;
    public String user;
    public String action;
    public String details;
    public String loggedAt;

    public AdminLogDto(Long id, String user, String action, String details, String loggedAt) {
        this.id = id;
        this.user = user;
        this.action = action;
        this.details = details;
        this.loggedAt = loggedAt;
    }
}
