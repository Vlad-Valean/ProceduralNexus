package com.proceduralnexus.apiservice.business.services;

import com.proceduralnexus.apiservice.business.interfaces.IOrganizationService;
import com.proceduralnexus.apiservice.controller.dtos.OrganizationCreateDto;
import com.proceduralnexus.apiservice.controller.dtos.OrganizationMemberDto;
import com.proceduralnexus.apiservice.controller.dtos.OrganizationResponseDto;
import com.proceduralnexus.apiservice.controller.dtos.OrganizationUpdateDto;
import com.proceduralnexus.apiservice.data.entities.Organization;
import com.proceduralnexus.apiservice.data.entities.Profile;
import com.proceduralnexus.apiservice.data.repositories.OrganizationRepository;
import com.proceduralnexus.apiservice.data.repositories.ProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrganizationService implements IOrganizationService {

    private final OrganizationRepository organizationRepository;
    private final ProfileRepository profileRepository;
    private final EmailService emailService;

    public OrganizationService(OrganizationRepository organizationRepository,
                               ProfileRepository profileRepository,
                               EmailService emailService) {
        this.organizationRepository = organizationRepository;
        this.profileRepository = profileRepository;
        this.emailService = emailService;
    }

    @Override
    public List<OrganizationResponseDto> getOrganizations() {
        return organizationRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public OrganizationResponseDto getOrganization(Long id) {
        Organization org = organizationRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization not found"));
        return toDto(org);
    }

    @Override
    @Transactional
    public OrganizationResponseDto createOrganization(OrganizationCreateDto request, Profile owner) {
        if (organizationRepository.existsByName(request.getName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Organization name already in use");
        }

        if (owner.getOrganization() != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Owner already belongs to an organization");
        }

        Organization org = new Organization();
        org.setName(request.getName());
        org.setOwner(owner);

        Organization saved = organizationRepository.save(org);

        owner.setOrganization(saved);
        profileRepository.save(owner);

        // Send organization created email to owner
        try {
            String ownerName = owner.getFirstname() + " " + owner.getLastname();
            emailService.sendOrganizationCreatedEmail(owner.getEmail(), ownerName, saved.getName());
        } catch (Exception e) {
            System.err.println("Failed to send organization created email: " + e.getMessage());
        }

        return toDto(saved);
    }

    @Override
    public OrganizationResponseDto updateOrganization(Long id,
                                                      OrganizationUpdateDto request,
                                                      Profile currentUser,
                                                      boolean isAdmin) {
        Organization org = organizationRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization not found"));

        if (!isAdmin && (org.getOwner() == null || !org.getOwner().getId().equals(currentUser.getId()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You are not allowed to update this organization");
        }

        if (!org.getName().equals(request.getName())
                && organizationRepository.existsByName(request.getName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Organization name already in use");
        }

        org.setName(request.getName());
        Organization saved = organizationRepository.save(org);
        return toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrganizationMemberDto> getOrganizationMembers(Long organizationId) {
        Organization org = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization not found"));

        return profileRepository.findAllByOrganization_Id(org.getId()).stream()
                .map(p -> new OrganizationMemberDto(
                        p.getId().toString(),
                        p.getFirstname(),
                        p.getLastname(),
                        p.getEmail(),
                        p.getRoles().stream().map(r -> r.getName().name()).toList()
                ))
                .toList();
    }

    @Override
    @Transactional
    public void deleteOrganization(Long organizationId, Profile currentUser, boolean isAdmin) {
        Organization org = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization not found"));

        boolean isOwner = org.getOwner() != null && org.getOwner().getId().equals(currentUser.getId());
        if (!isOwner && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Only the owner or an admin can delete the organization");
        }

        // 1) toti userii din org -> organization = null
        List<Profile> members = profileRepository.findAllByOrganization_Id(org.getId());
        for (Profile p : members) {
            p.setOrganization(null);
        }
        profileRepository.saveAll(members);

        profileRepository.flush();

        organizationRepository.deleteById(org.getId());
        organizationRepository.flush();
    }

    private OrganizationResponseDto toDto(Organization org) {
        OrganizationResponseDto dto = new OrganizationResponseDto();
        dto.setId(org.getId());
        dto.setName(org.getName());

        if (org.getOwner() != null) {
            dto.setOwnerId(org.getOwner().getId().toString());
            dto.setOwnerFirstname(org.getOwner().getFirstname());
            dto.setOwnerLastname(org.getOwner().getLastname());
            dto.setOwnerEmail(org.getOwner().getEmail());
        }

        dto.setMembersCount(
                org.getMembers() != null ? org.getMembers().size() : 0
        );

        dto.setCreatedAt(org.getCreatedAt());
        dto.setUpdatedAt(org.getUpdatedAt());
        return dto;
    }
}
