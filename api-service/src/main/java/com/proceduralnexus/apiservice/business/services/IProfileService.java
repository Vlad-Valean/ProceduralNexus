package com.proceduralnexus.apiservice.business.services;
import com.proceduralnexus.apiservice.controller.dtos.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface IProfileService {

    List<ProfileResponseDto> getProfiles();

    ProfileResponseDto getProfile(UUID id);

    ProfileResponseDto updateProfile(UUID id, ProfileUpdateDto request);

    void deleteProfile(UUID id);
}
