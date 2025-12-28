package com.proceduralnexus.apiservice.controller.controllers;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    /**
     * POST /organizations
     * Body: OrganizationCreateDto (name)
     * Owner = current authenticated profile
     */
    @PostMapping
    @Operation(
            summary = "Create organization",
            description = "Creates a new organization. The current user becomes the owner."
    )
    public OrganizationResponseDto createOrganization(
            @Valid @RequestBody OrganizationCreateDto request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails.getUsername();
        Profile owner = profileService.findByEmail(email);
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
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        return organizationService.updateOrganization(id, request, currentUser, isAdmin);
    }
}
