package com.proceduralnexus.apiservice.data.entities;

import java.time.Instant;
import java.util.UUID;

/**
 * Placeholder POJO for previously used UserActivity entity.
 * Converted to a regular class (no JPA annotations) to avoid Hibernate schema validation
 * since logging now uses the existing `log_entry` table / `LogEntry` entity.
 */
public class UserActivity {

    private UUID id;
    private UUID userId;
    private String userEmail;
    private String action;
    private String description;
    private Instant createdAt;

    public UserActivity() { }

    public UserActivity(UUID userId, String userEmail, String action, String description, Instant createdAt) {
        this.userId = userId;
        this.userEmail = userEmail;
        this.action = action;
        this.description = description;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
