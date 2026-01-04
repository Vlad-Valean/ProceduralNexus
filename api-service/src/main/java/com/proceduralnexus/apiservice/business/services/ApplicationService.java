package com.proceduralnexus.apiservice.business.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.proceduralnexus.apiservice.controller.dtos.ApplicationCreateRequestDto;
import com.proceduralnexus.apiservice.controller.dtos.ApplicationResponseDto;
import com.proceduralnexus.apiservice.data.entities.Application;
import com.proceduralnexus.apiservice.data.entities.Document;
import com.proceduralnexus.apiservice.data.entities.Organization;
import com.proceduralnexus.apiservice.data.entities.Profile;
import com.proceduralnexus.apiservice.data.repositories.ApplicationRepository;
import com.proceduralnexus.apiservice.data.repositories.DocumentRepository;
import com.proceduralnexus.apiservice.data.repositories.OrganizationRepository;
import com.proceduralnexus.apiservice.data.repositories.ProfileRepository;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ProfileRepository profileRepository;
    private final OrganizationRepository organizationRepository;
    private final DocumentRepository documentRepository;
    private final EmailService emailService;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            ProfileRepository profileRepository,
            OrganizationRepository organizationRepository,
            DocumentRepository documentRepository,
            EmailService emailService
    ) {
        this.applicationRepository = applicationRepository;
        this.profileRepository = profileRepository;
        this.organizationRepository = organizationRepository;
        this.documentRepository = documentRepository;
        this.emailService = emailService;
    }

    @Transactional
    public ApplicationResponseDto createApplication(String applicantEmail, ApplicationCreateRequestDto req) {
        if (req.getOrganizationId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "organizationId is required");
        }

        Profile applicant = profileRepository.findByEmail(applicantEmail)
                .orElseThrow(() -> {
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Applicant profile not found");
                });

        Organization org = organizationRepository.findById(req.getOrganizationId())
                .orElseThrow(() -> {
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization not found");
                });

        applicationRepository.findByApplicant_IdAndOrganization_Id(applicant.getId(), org.getId())
                .ifPresent(a -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Application already exists for this organization");
                });

        Document cv = null;
        if (req.getCvDocumentId() != null) {
            cv = documentRepository.findById(req.getCvDocumentId())
                    .orElseThrow(() -> {
                        return new ResponseStatusException(HttpStatus.NOT_FOUND, "CV document not found");
                    });
        }

        Application app = new Application();
        app.setApplicant(applicant);
        app.setOrganization(org);
        app.setCv(cv);
        app.setStatus(Application.ApplicationStatus.PENDING);

        Application saved = applicationRepository.save(app);
        return toDto(saved);
    }

    public List<ApplicationResponseDto> listPendingForHr(String hrEmail) {
        Profile hr = profileRepository.findByEmail(hrEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "HR profile not found"));

        if (hr.getOrganization() == null) {
            return List.of();
        }

        Long orgId = hr.getOrganization().getId();

        return applicationRepository
                .findByOrganization_IdAndStatusOrderByCreatedAtDesc(orgId, Application.ApplicationStatus.PENDING)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ApplicationResponseDto> listForApplicant(String applicantEmail) {
        Profile applicant = profileRepository.findByEmail(applicantEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Applicant profile not found"));

        return applicationRepository
                .findByApplicant_IdOrderByCreatedAtDesc(applicant.getId())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void accept(Long applicationId, String hrEmail) {
        Profile hr = profileRepository.findByEmail(hrEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "HR profile not found"));

        if (hr.getOrganization() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "HR has no organization");
        }

        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        if (!app.getOrganization().getId().equals(hr.getOrganization().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed for this organization");
        }

        Profile applicant = app.getApplicant();
        Organization organization = hr.getOrganization();
        
        applicant.setOrganization(organization);
        profileRepository.save(applicant);

        applicationRepository.delete(app);

        // Send acceptance email notification
        try {
            String userName = applicant.getFirstname() + " " + applicant.getLastname();
            emailService.sendApplicationAcceptedEmail(applicant.getEmail(), userName, organization.getName());
        } catch (Exception e) {
            System.err.println("Failed to send application accepted email: " + e.getMessage());
        }
    }

    @Transactional
    public void reject(Long applicationId, String hrEmail) {
        Profile hr = profileRepository.findByEmail(hrEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "HR profile not found"));

        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        if (hr.getOrganization() == null || !app.getOrganization().getId().equals(hr.getOrganization().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed for this organization");
        }

        Profile applicant = app.getApplicant();
        Organization organization = app.getOrganization();
        
        applicationRepository.delete(app);

        // Send rejection email notification
        try {
            String userName = applicant.getFirstname() + " " + applicant.getLastname();
            emailService.sendApplicationRejectedEmail(applicant.getEmail(), userName, organization.getName(), null);
        } catch (Exception e) {
            System.err.println("Failed to send application rejected email: " + e.getMessage());
        }
    }

    private ApplicationResponseDto toDto(Application app) {
        ApplicationResponseDto dto = new ApplicationResponseDto();
        dto.setId(app.getId());

        Profile p = app.getApplicant();
        dto.setApplicantId(p.getId().toString());
        dto.setApplicantEmail(p.getEmail());
        dto.setApplicantFirstname(p.getFirstname());
        dto.setApplicantLastname(p.getLastname());

        // Add organizationId to the response
        if (app.getOrganization() != null) {
            dto.setOrganizationId(app.getOrganization().getId());
        }

        if (app.getCv() != null) {
            dto.setCvDocumentId(app.getCv().getId());
            dto.setCvFileName(app.getCv().getName());
        }

        dto.setCreatedAt(app.getCreatedAt());
        return dto;
    }
}
