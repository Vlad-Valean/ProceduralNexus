package com.proceduralnexus.apiservice.controller.controllers;

import com.proceduralnexus.apiservice.business.services.HrDashboardService;
import com.proceduralnexus.apiservice.business.services.PasswordResetService;
import com.proceduralnexus.apiservice.controller.dtos.HrAddUserRequestDto;
import com.proceduralnexus.apiservice.controller.dtos.HrUsersResponseDto;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/hr")
public class HrDashboardController {

    private final HrDashboardService hrDashboardService;
    
    @Autowired
    private PasswordResetService passwordResetService;

    public HrDashboardController(HrDashboardService hrDashboardService) {
        this.hrDashboardService = hrDashboardService;
    }

    @GetMapping("/users")
    public ResponseEntity<HrUsersResponseDto> getMyOrgUsers() {
        return ResponseEntity.ok(hrDashboardService.getMyOrganizationUsers());
    }

    @PostMapping("/users/add")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void addExistingUserToMyOrg(@Valid @RequestBody HrAddUserRequestDto req) {
        hrDashboardService.addExistingUserToMyOrganization(req);
    }

    @PostMapping("/users/{userId}/remove")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeUserFromMyOrg(@PathVariable UUID userId) {
        hrDashboardService.removeUserFromMyOrganization(userId);
    }

    @PostMapping("/users/{email}/reset-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resetUserPassword(@PathVariable String email) {
        passwordResetService.createPasswordResetToken(email);
    }
}
