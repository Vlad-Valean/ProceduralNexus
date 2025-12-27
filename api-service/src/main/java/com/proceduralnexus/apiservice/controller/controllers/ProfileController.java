package com.proceduralnexus.apiservice.controller.controllers;

import java.util.List;
import java.util.UUID;

import com.proceduralnexus.apiservice.controller.dtos.ProfilePatchRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.proceduralnexus.apiservice.business.services.ProfileService;
import com.proceduralnexus.apiservice.controller.dtos.ProfileResponseDto;
import com.proceduralnexus.apiservice.controller.dtos.ProfileUpdateDto;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/profiles")
@Tag(name = "Profiles", description = "Endpoints for managing user profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    /**
     * GET /profiles
     * Optional filters: firstname, lastname, email
     */
    @GetMapping
    @Operation(
            summary = "List profiles",
            description = "Returns a list of all profiles."
    )
    public List<ProfileResponseDto> listProfiles() {
        return profileService.getProfiles();
    }

    /**
     * GET /profiles/{id}
     */
    @GetMapping("/{id}")
    @Operation(
            summary = "Get profile by ID",
            description = "Returns a single profile by its unique identifier."
    )
    public ProfileResponseDto getProfile(@PathVariable UUID id) {
        return profileService.getProfile(id);
    }

    /**
     * PUT /profiles/{id}
     * Body: ProfileUpdateDto (firstname, lastname, email, emailVerified)
     */
    @PutMapping("/{id}")
    @Operation(
            summary = "Update profile",
            description = "Updates firstname, lastname, email and emailVerified for the given profile."
    )
    public ProfileResponseDto updateProfile(
            @PathVariable UUID id,
            @Valid @RequestBody ProfileUpdateDto request
    ) {
        return profileService.updateProfile(id, request);
    }

    @PatchMapping("/profiles/{id}")
    public ProfileResponseDto patchProfile(@PathVariable UUID id,
                                           @RequestBody ProfilePatchRequest req) {
        return profileService.patchProfile(id, req);
    }


    /**
     * DELETE /profiles/{id}
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
            summary = "Delete profile",
            description = "Deletes the profile with the given ID."
    )
    public void deleteProfile(@PathVariable UUID id) {
        profileService.deleteProfile(id);
    }
}