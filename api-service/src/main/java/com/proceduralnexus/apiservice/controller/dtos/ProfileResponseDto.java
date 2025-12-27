
package com.proceduralnexus.apiservice.controller.dtos;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class ProfileResponseDto {
    private UUID id;
    private String firstname;
    private String lastname;
    private String email;
    private boolean emailVerified;
    private Instant createdAt;
    private Instant updatedAt;
    private List<String> roles;
    private Long organizationId;

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public UUID getId() { 
        return id; 
    }

    public void setId(UUID id) { 
        this.id = id; 
    }

    public String getFirstname() {
         return firstname; 
    }

    public void setFirstname(String firstname) { 
        this.firstname = firstname; 
    }

    public String getLastname() { 
        return lastname; 
    }

    public void setLastname(String lastname) { 
        this.lastname = lastname; 
    }

    public String getEmail() { 
        return email; 
    }
    
    public void setEmail(String email) { 
        this.email = email; 
    }

    public boolean isEmailVerified() { 
        return emailVerified; 
    }
    
    public void setEmailVerified(boolean emailVerified) { 
        this.emailVerified = emailVerified; 
    }

    public Instant getCreatedAt() { 
        return createdAt; 
    }

    public void setCreatedAt(Instant createdAt) { 
        this.createdAt = createdAt; 
    }

    public Instant getUpdatedAt() { 
        return updatedAt; 
    }

    public void setUpdatedAt(Instant updatedAt) { 
        this.updatedAt = updatedAt; 
    }

    public List<String> getRoles() { 
        return roles; 
    }

    public void setRoles(List<String> roles) { 
        this.roles = roles; 
    }
}