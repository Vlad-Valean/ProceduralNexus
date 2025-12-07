package com.proceduralnexus.apiservice.business.interfaces;

import com.proceduralnexus.apiservice.controller.dtos.OrganizationCreateDto;
import com.proceduralnexus.apiservice.controller.dtos.OrganizationResponseDto;
import com.proceduralnexus.apiservice.controller.dtos.OrganizationUpdateDto;
import com.proceduralnexus.apiservice.data.entities.Profile;

import java.util.List;

public interface IOrganizationService {

    List<OrganizationResponseDto> getOrganizations();

    OrganizationResponseDto getOrganization(Long id);

    OrganizationResponseDto createOrganization(OrganizationCreateDto request, Profile owner);

    OrganizationResponseDto updateOrganization(Long id, OrganizationUpdateDto request,
                                               Profile currentUser, boolean isAdmin);
}
