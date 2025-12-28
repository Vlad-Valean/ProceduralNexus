package com.proceduralnexus.apiservice.business.services;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.proceduralnexus.apiservice.controller.dtos.ProfilePatchRequest;
import com.proceduralnexus.apiservice.data.entities.Organization;
import com.proceduralnexus.apiservice.data.entities.RoleName;
import com.proceduralnexus.apiservice.data.repositories.RoleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.proceduralnexus.apiservice.business.interfaces.IProfileService;
import com.proceduralnexus.apiservice.controller.dtos.ProfileResponseDto;
import com.proceduralnexus.apiservice.controller.dtos.ProfileUpdateDto;
import com.proceduralnexus.apiservice.data.entities.Profile;
import com.proceduralnexus.apiservice.data.repositories.ProfileRepository;
import com.proceduralnexus.apiservice.data.repositories.OrganizationRepository;


@Service
public class ProfileService implements IProfileService {

    private final ProfileRepository profileRepository;
    private final OrganizationRepository organizationRepository;
    private final RoleRepository roleRepository;


    public ProfileService(ProfileRepository profileRepository, OrganizationRepository organizationRepository, RoleRepository roleRepository) {
        this.profileRepository = profileRepository;
        this.organizationRepository = organizationRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public List<ProfileResponseDto> getProfiles() {

        List<Profile> profiles = profileRepository.findAll();

        return profiles.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProfileResponseDto getProfile(UUID id) {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));
        return toDto(profile);
    }

    @Override
    public ProfileResponseDto updateProfile(UUID id, ProfileUpdateDto request) {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));

        profile.setFirstname(request.getFirstname());
        profile.setLastname(request.getLastname());
        profile.setEmail(request.getEmail());

        if (request.getEmailVerified() != null) {
            profile.setEmailVerified(request.getEmailVerified());
        }

        if (request.getOrganizationId() != null) {
            Organization org = organizationRepository.findById(request.getOrganizationId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization not found"));
            profile.setOrganization(org);
        }

        Profile saved = profileRepository.save(profile);
        return toDto(saved);
    }

    @Override
    public void deleteProfile(UUID id) {
        if (!profileRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found");
        }
        profileRepository.deleteById(id);
    }

    public Profile findById(UUID id) {
        return profileRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));
    }

    public ProfileResponseDto toDto(Profile profile) {
        ProfileResponseDto dto = new ProfileResponseDto();
        dto.setId(profile.getId());
        dto.setFirstname(profile.getFirstname());
        dto.setLastname(profile.getLastname());
        dto.setEmail(profile.getEmail());
        dto.setEmailVerified(profile.isEmailVerified());
        dto.setCreatedAt(profile.getCreatedAt());
        dto.setUpdatedAt(profile.getUpdatedAt());
        dto.setRoles(profile.getRoles().stream()
            .map(role -> role.getName().name())
            .collect(Collectors.toList()));
        dto.setOrganizationId(profile.getOrganization() != null ? profile.getOrganization().getId() : null);
        return dto;
    }

    public Profile findByEmail(String email) {
        return profileRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));
    }

    @Transactional
    public ProfileResponseDto patchProfile(UUID id, ProfilePatchRequest req) {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));

        if (req.getFirstname() != null) {
            profile.setFirstname(req.getFirstname());
        }

        if (req.getLastname() != null) {
            profile.setLastname(req.getLastname());
        }

        if (req.getOrganizationId() != null) {
            Organization org = organizationRepository.findById(req.getOrganizationId())
                    .orElseThrow(() ->
                            new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization not found"));
            profile.setOrganization(org);
        }

        if (req.getRoles() != null) {
            var newRoles = req.getRoles().stream()
                    .map(String::trim)
                    .map(String::toUpperCase)
                    .map(roleStr -> {
                        try {
                            return RoleName.valueOf(roleStr);
                        } catch (IllegalArgumentException ex) {
                            throw new ResponseStatusException(
                                    HttpStatus.BAD_REQUEST,
                                    "Invalid role: " + roleStr
                            );
                        }
                    })
                    .map(roleName -> roleRepository.findByName(roleName)
                            .orElseThrow(() -> new ResponseStatusException(
                                    HttpStatus.BAD_REQUEST,
                                    "Role not found in DB: " + roleName
                            )))
                    .collect(Collectors.toSet());

            profile.setRoles(newRoles);
        }

        return toDto(profile);
    }

}