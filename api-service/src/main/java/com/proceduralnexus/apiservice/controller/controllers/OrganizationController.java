package com.proceduralnexus.apiservice.controller.controllers;

import java.util.List;

import com.proceduralnexus.apiservice.controller.dtos.OrganizationMemberDto;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.proceduralnexus.apiservice.business.interfaces.IOrganizationService;
import com.proceduralnexus.apiservice.business.services.ProfileService;
import com.proceduralnexus.apiservice.controller.dtos.OrganizationCreateDto;
import com.proceduralnexus.apiservice.controller.dtos.OrganizationResponseDto;
import com.proceduralnexus.apiservice.controller.dtos.OrganizationUpdateDto;
import com.proceduralnexus.apiservice.data.entities.Profile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/organizations")
@Tag(name = "Organizations", description = "Endpoints for managing organizations")
@SecurityRequirement(name = "bearerAuth")
public class OrganizationController {

    private final IOrganizationService organizationService;
    private final ProfileService profileService;

    public OrganizationController(IOrganizationService organizationService,
                                  ProfileService profileService) {
        this.organizationService = organizationService;
        this.profileService = profileService;
    }

    /**
     * GET /organizations
     */
    @GetMapping
    @Operation(
            summary = "List organizations",
            description = "Returns a list of all organizations."
    )
    public List<OrganizationResponseDto> listOrganizations() {
        return organizationService.getOrganizations();
    }

    /**
     * GET /organizations/{id}
     */
    @GetMapping("/{id}")
    @Operation(
            summary = "Get organization by ID",
            description = "Returns a single organization by its ID."
    )
    public OrganizationResponseDto getOrganization(@PathVariable Long id) {
        return organizationService.getOrganization(id);
    }

    @PostMapping
    @Operation(
            summary = "Create organization",
            description = "Creates a new organization. Default owner is current user. If caller is ADMIN, can provide ownerEmail."
    )
    public OrganizationResponseDto createOrganization(
            @Valid @RequestBody OrganizationCreateDto request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Profile owner;

        if (request.getOwnerEmail() != null && !request.getOwnerEmail().isBlank()) {
            owner = profileService.findByEmail(request.getOwnerEmail().trim());
        } else {
            owner = profileService.findByEmail(userDetails.getUsername());
        }

        return organizationService.createOrganization(request, owner);
    }


    /**
     * PUT /organizations/{id}
     * Body: OrganizationUpdateDto (name)
     * Only owner or admin can update
     */
    @PutMapping("/{id}")
    @Operation(
            summary = "Update organization",
            description = "Updates the organization name. Only the owner or an admin can perform this action."
    )
    public OrganizationResponseDto updateOrganization(
            @PathVariable Long id,
            @Valid @RequestBody OrganizationUpdateDto request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails.getUsername();
        Profile currentUser = profileService.findByEmail(email);

        boolean isAdmin = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ADMIN"));

        return organizationService.updateOrganization(id, request, currentUser, isAdmin);
    }

    /**
     * GET /organizations/{id}/members
     */
    @GetMapping("/{id}/members")
    @Operation(
            summary = "List organization members",
            description = "Returns a list of profiles that belong to the organization."
    )
    public List<OrganizationMemberDto> listOrganizationMembers(@PathVariable Long id) {
        return organizationService.getOrganizationMembers(id);
    }

    /**
     * DELETE /organizations/{id}
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
            summary = "Delete organization",
            description = "Deletes an organization. Only the owner or an admin can delete."
    )
    public void deleteOrganization(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails.getUsername();
        Profile currentUser = profileService.findByEmail(email);


        boolean isAdmin = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ADMIN"));

        organizationService.deleteOrganization(id, currentUser, isAdmin);
    }
}
