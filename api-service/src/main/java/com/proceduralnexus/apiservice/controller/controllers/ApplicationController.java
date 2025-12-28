package com.proceduralnexus.apiservice.controller.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.proceduralnexus.apiservice.business.services.ApplicationService;
import com.proceduralnexus.apiservice.controller.dtos.ApplicationCreateRequestDto;
import com.proceduralnexus.apiservice.controller.dtos.ApplicationResponseDto;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@CrossOrigin(origins = "*", maxAge = 3600)
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/applications")
@Tag(name = "Applications", description = "Endpoints for creating and managing applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create application", description = "Applicant creates an application to an organization.")
    public ApplicationResponseDto create(
            @RequestBody ApplicationCreateRequestDto req,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return applicationService.createApplication(userDetails.getUsername(), req);
    }

    @GetMapping
    @Operation(summary = "List pending applications for HR org", description = "Returns pending applications for the HR's organization.")
    public List<ApplicationResponseDto> listForHr(@AuthenticationPrincipal UserDetails userDetails) {
        return applicationService.listPendingForHr(userDetails.getUsername());
    }

    @PostMapping("/{id}/accept")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Accept application", description = "Accept application: set applicant organization and delete application.")
    public void accept(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        applicationService.accept(id, userDetails.getUsername());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Reject application", description = "Reject application: delete application.")
    public void reject(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        applicationService.reject(id, userDetails.getUsername());
    }

    @GetMapping("/mine")
    @Operation(summary = "List applications for the current applicant", description = "Returns all applications submitted by the current user.")
    public List<ApplicationResponseDto> listForApplicant(@AuthenticationPrincipal UserDetails userDetails) {
        return applicationService.listForApplicant(userDetails.getUsername());
    }
}
