package com.proceduralnexus.apiservice.business.services;

import com.proceduralnexus.apiservice.controller.dtos.HrAddUserRequestDto;
import com.proceduralnexus.apiservice.controller.dtos.HrUsersResponseDto;
import com.proceduralnexus.apiservice.data.entities.Document;
import com.proceduralnexus.apiservice.data.entities.Organization;
import com.proceduralnexus.apiservice.data.entities.Profile;
import com.proceduralnexus.apiservice.data.entities.RoleName;
import com.proceduralnexus.apiservice.data.repositories.ApplicationRepository;
import com.proceduralnexus.apiservice.data.repositories.DocumentRepository;
import com.proceduralnexus.apiservice.data.repositories.ProfileRepository;
import com.proceduralnexus.apiservice.data.repositories.RoleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class HrDashboardService {

    private final ProfileRepository profileRepository;
    private final ApplicationRepository applicationRepository;
    private final RoleRepository roleRepository;
    private final DocumentRepository documentRepository;


    public HrDashboardService(
            ProfileRepository profileRepository,
            ApplicationRepository applicationRepository,
            RoleRepository roleRepository,
            DocumentRepository documentRepository
    ) {
        this.profileRepository = profileRepository;
        this.applicationRepository = applicationRepository;
        this.roleRepository = roleRepository;
        this.documentRepository = documentRepository;
    }

    public HrUsersResponseDto getMyOrganizationUsers() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String email = (auth != null) ? auth.getName() : null;
        if (email == null) throw new RuntimeException("Unauthenticated");

        Profile me = profileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        Organization org = me.getOrganization();
        if (org == null) return new HrUsersResponseDto(null, null, List.of());

        UUID ownerId = (org.getOwner() != null) ? org.getOwner().getId() : null;

        List<Profile> members = profileRepository.findAllByOrganization_Id(org.getId());

        List<HrUsersResponseDto.UserRowDto> rows = members.stream()
                .filter(p -> ownerId == null || !p.getId().equals(ownerId))
                .map(p -> new HrUsersResponseDto.UserRowDto(
                        p.getId(),
                        p.getFirstname(),
                        p.getLastname(),
                        p.getEmail()
                ))
                .toList();

        return new HrUsersResponseDto(org.getId(), org.getName(), rows);
    }

    @Transactional
    public void addExistingUserToMyOrganization(HrAddUserRequestDto req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String hrEmail = (auth != null) ? auth.getName() : null;
        if (hrEmail == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthenticated");

        Profile hr = profileRepository.findByEmail(hrEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "HR profile not found"));

        Organization org = hr.getOrganization();
        if (org == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "HR has no organization");

        String targetEmail = req.getEmail() == null ? null : req.getEmail().trim();
        if (targetEmail == null || targetEmail.isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "email is required");

        Profile target = profileRepository.findByEmail(targetEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (target.getId().equals(hr.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot add yourself.");
        }

        target.setOrganization(org);

        RoleName roleName;
        try {
            roleName = RoleName.valueOf(req.getRole().trim().toUpperCase());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role: " + req.getRole());
        }

        var roleEntity = roleRepository.findByName(roleName)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role not found in DB: " + roleName));

        var roles = target.getRoles();
        if (roles == null) {
            roles = new java.util.HashSet<>();
            target.setRoles(roles);
        } else {
            roles.clear();
        }
        target.getRoles().add(roleEntity);

        profileRepository.save(target);

        applicationRepository.deleteByApplicant_Id(target.getId());
    }

    @Transactional
    public void removeUserFromMyOrganization(UUID userId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String hrEmail = (auth != null) ? auth.getName() : null;
        if (hrEmail == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthenticated");

        Profile hr = profileRepository.findByEmail(hrEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "HR profile not found"));

        Organization org = hr.getOrganization();
        if (org == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "HR has no organization");

        Profile target = profileRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (target.getOrganization() == null || !target.getOrganization().getId().equals(org.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not in your organization");
        }

        if (org.getOwner() != null && org.getOwner().getId().equals(target.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot remove organization owner");
        }

        target.setOrganization(null);
        profileRepository.save(target);

        documentRepository.deleteByUploader_IdAndTypeNot(target.getId(), Document.DocumentType.CV);

    }
}
