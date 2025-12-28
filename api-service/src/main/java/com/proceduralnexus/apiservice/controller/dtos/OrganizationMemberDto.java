package com.proceduralnexus.apiservice.controller.dtos;

import java.util.List;

public class OrganizationMemberDto {
    private String id; // UUID string
    private String firstname;
    private String lastname;
    private String email;
    private List<String> roles;

    public OrganizationMemberDto() {}

    public OrganizationMemberDto(String id, String firstname, String lastname, String email, List<String> roles) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.roles = roles;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFirstname() { return firstname; }
    public void setFirstname(String firstname) { this.firstname = firstname; }

    public String getLastname() { return lastname; }
    public void setLastname(String lastname) { this.lastname = lastname; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }
}
