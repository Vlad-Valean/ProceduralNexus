package com.proceduralnexus.apiservice.business.services;

import com.proceduralnexus.apiservice.business.interfaces.IOrganizationService;
import com.proceduralnexus.apiservice.controller.dtos.OrganizationCreateDto;
import com.proceduralnexus.apiservice.controller.dtos.OrganizationResponseDto;
import com.proceduralnexus.apiservice.controller.dtos.OrganizationUpdateDto;
import com.proceduralnexus.apiservice.data.entities.Organization;
import com.proceduralnexus.apiservice.data.entities.Profile;
import com.proceduralnexus.apiservice.data.repositories.OrganizationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrganizationService implements IOrganizationService {

    private final OrganizationRepository organizationRepository;

    public OrganizationService(OrganizationRepository organizationRepository) {
        this.organizationRepository = organizationRepository;
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
    public OrganizationResponseDto createOrganization(OrganizationCreateDto request, Profile owner) {
        if (organizationRepository.existsByName(request.getName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Organization name already in use");
        }

        Organization org = new Organization();
        org.setName(request.getName());
        org.setOwner(owner);

        Organization saved = organizationRepository.save(org);
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

        // only owner or admin
        if (!isAdmin && !org.getOwner().getId().equals(currentUser.getId())) {
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
