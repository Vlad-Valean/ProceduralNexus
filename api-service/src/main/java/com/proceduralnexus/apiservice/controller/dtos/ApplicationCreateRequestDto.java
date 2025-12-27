package com.proceduralnexus.apiservice.controller.dtos;

public class ApplicationCreateRequestDto {
    private Long organizationId;
    private Long cvDocumentId;

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }

    public Long getCvDocumentId() { return cvDocumentId; }
    public void setCvDocumentId(Long cvDocumentId) { this.cvDocumentId = cvDocumentId; }
}
