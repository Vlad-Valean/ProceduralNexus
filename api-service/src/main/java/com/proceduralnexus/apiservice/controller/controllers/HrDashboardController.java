package com.proceduralnexus.apiservice.controller.controllers;

import com.proceduralnexus.apiservice.business.services.HrDashboardService;
import com.proceduralnexus.apiservice.controller.dtos.HrUsersResponseDto;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/hr")
public class HrDashboardController {

    private final HrDashboardService hrDashboardService;

    public HrDashboardController(HrDashboardService hrDashboardService) {
        this.hrDashboardService = hrDashboardService;
    }

    @GetMapping("/users")
    public ResponseEntity<HrUsersResponseDto> getMyOrgUsers() {
        return ResponseEntity.ok(hrDashboardService.getMyOrganizationUsers());
    }
}
