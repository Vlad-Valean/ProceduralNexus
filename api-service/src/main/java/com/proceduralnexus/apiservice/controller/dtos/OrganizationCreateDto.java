package com.proceduralnexus.apiservice.controller.dtos;

import jakarta.validation.constraints.NotBlank;

public class OrganizationCreateDto {

    @NotBlank
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
