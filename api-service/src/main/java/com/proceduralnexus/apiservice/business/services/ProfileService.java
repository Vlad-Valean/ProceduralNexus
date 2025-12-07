package com.proceduralnexus.apiservice.business.services;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.proceduralnexus.apiservice.business.interfaces.IProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.proceduralnexus.apiservice.controller.dtos.ProfileResponseDto;
import com.proceduralnexus.apiservice.controller.dtos.ProfileUpdateDto;
import com.proceduralnexus.apiservice.data.entities.Profile;
import com.proceduralnexus.apiservice.data.repositories.ProfileRepository;

@Service
public class ProfileService implements IProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
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
        return dto;
    }

    public Profile findByEmail(String email) {
        return profileRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));
    }
}