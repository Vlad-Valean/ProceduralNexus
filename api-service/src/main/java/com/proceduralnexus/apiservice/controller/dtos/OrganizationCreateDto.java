package com.proceduralnexus.apiservice.controller.dtos;

import jakarta.validation.constraints.NotBlank;

public class OrganizationCreateDto {

    @NotBlank
    private String name;
    private String ownerEmail;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getOwnerEmail() { return ownerEmail; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }
}
