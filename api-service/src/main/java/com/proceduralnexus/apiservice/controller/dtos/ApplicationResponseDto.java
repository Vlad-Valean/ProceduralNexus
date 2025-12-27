package com.proceduralnexus.apiservice.controller.dtos;

import java.time.Instant;

public class ApplicationResponseDto {
    private Long id;

    private String applicantId;
    private String applicantEmail;
    private String applicantFirstname;
    private String applicantLastname;

    private Long cvDocumentId;
    private String cvFileName;

    private Instant createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getApplicantId() { return applicantId; }
    public void setApplicantId(String applicantId) { this.applicantId = applicantId; }

    public String getApplicantEmail() { return applicantEmail; }
    public void setApplicantEmail(String applicantEmail) { this.applicantEmail = applicantEmail; }

    public String getApplicantFirstname() { return applicantFirstname; }
    public void setApplicantFirstname(String applicantFirstname) { this.applicantFirstname = applicantFirstname; }

    public String getApplicantLastname() { return applicantLastname; }
    public void setApplicantLastname(String applicantLastname) { this.applicantLastname = applicantLastname; }

    public Long getCvDocumentId() { return cvDocumentId; }
    public void setCvDocumentId(Long cvDocumentId) { this.cvDocumentId = cvDocumentId; }

    public String getCvFileName() { return cvFileName; }
    public void setCvFileName(String cvFileName) { this.cvFileName = cvFileName; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
