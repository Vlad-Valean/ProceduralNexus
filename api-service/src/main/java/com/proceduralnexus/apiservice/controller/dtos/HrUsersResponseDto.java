package com.proceduralnexus.apiservice.controller.dtos;

import java.util.List;
import java.util.UUID;

public class HrUsersResponseDto {
    private Long organizationId;
    private String organizationName;
    private List<UserRowDto> users;

    public static class UserRowDto {
        private UUID id;
        private String firstname;
        private String lastname;
        private String email;

        public UserRowDto(UUID id, String firstname, String lastname, String email) {
            this.id = id;
            this.firstname = firstname;
            this.lastname = lastname;
            this.email = email;
        }

        public UUID getId() { return id; }
        public String getFirstname() { return firstname; }
        public String getLastname() { return lastname; }
        public String getEmail() { return email; }
    }

    public HrUsersResponseDto(Long organizationId, String organizationName, List<UserRowDto> users) {
        this.organizationId = organizationId;
        this.organizationName = organizationName;
        this.users = users;
    }

    public Long getOrganizationId() { return organizationId; }
    public String getOrganizationName() { return organizationName; }
    public List<UserRowDto> getUsers() { return users; }
}
