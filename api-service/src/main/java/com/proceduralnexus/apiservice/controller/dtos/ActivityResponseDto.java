package com.proceduralnexus.apiservice.controller.dtos;

import java.time.Instant;

public class ActivityResponseDto {
    private Long id;
    private String userId;
    private String userEmail;
    private String action;
    private String description;
    private Instant createdAt;

    public ActivityResponseDto() {}

    public ActivityResponseDto(Long id, String userId, String userEmail, String action, String description, Instant createdAt) {
        this.id = id;
        this.userId = userId;
        this.userEmail = userEmail;
        this.action = action;
        this.description = description;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
