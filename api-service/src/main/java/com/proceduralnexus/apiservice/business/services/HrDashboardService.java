package com.proceduralnexus.apiservice.business.services;

import com.proceduralnexus.apiservice.controller.dtos.HrUsersResponseDto;
import com.proceduralnexus.apiservice.data.entities.Organization;
import com.proceduralnexus.apiservice.data.entities.Profile;
import com.proceduralnexus.apiservice.data.repositories.ProfileRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HrDashboardService {

    private final ProfileRepository profileRepository;

    public HrDashboardService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public HrUsersResponseDto getMyOrganizationUsers() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // În proiectul tău, principal e UserDetails -> username = email
        String email = (auth != null) ? auth.getName() : null;
        if (email == null) {
            throw new RuntimeException("Unauthenticated");
        }

        Profile me = profileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        Organization org = me.getOrganization();
        if (org == null) {
            // HR fără organizație -> returnezi gol (frontend poate afișa mesaj)
            return new HrUsersResponseDto(null, null, List.of());
        }

        List<Profile> members = profileRepository.findAllByOrganization_Id(org.getId());

        List<HrUsersResponseDto.UserRowDto> rows = members.stream()
                .map(p -> new HrUsersResponseDto.UserRowDto(
                        p.getId(), p.getFirstname(), p.getLastname(), p.getEmail()
                ))
                .toList();

        return new HrUsersResponseDto(org.getId(), org.getName(), rows);
    }
}
