package com.proceduralnexus.apiservice.business.interfaces;
import com.proceduralnexus.apiservice.controller.dtos.*;

import java.util.List;
import java.util.UUID;

public interface IProfileService {

    List<ProfileResponseDto> getProfiles();

    ProfileResponseDto getProfile(UUID id);

    ProfileResponseDto updateProfile(UUID id, ProfileUpdateDto request);

    void deleteProfile(UUID id);
}
