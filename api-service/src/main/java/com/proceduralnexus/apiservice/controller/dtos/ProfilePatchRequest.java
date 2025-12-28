package com.proceduralnexus.apiservice.controller.dtos;

public class ProfilePatchRequest {
    private String firstname;
    private String lastname;
    private Long organizationId; // null = nu schimbi; (vezi mai jos pt “remove”)

    public String getFirstname() { return firstname; }
    public void setFirstname(String firstname) { this.firstname = firstname; }

    public String getLastname() { return lastname; }
    public void setLastname(String lastname) { this.lastname = lastname; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }
}
