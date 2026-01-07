package com.proceduralnexus.apiservice.controller.controllers;

import com.proceduralnexus.apiservice.business.services.PasswordResetService;
import com.proceduralnexus.apiservice.business.services.LoggingService;
import com.proceduralnexus.apiservice.controller.dtos.AdminLogDto;
import com.proceduralnexus.apiservice.data.entities.LogEntry;
import com.proceduralnexus.apiservice.data.repositories.LogEntryRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/logs")
public class AdminLogsController {
    private final LogEntryRepository logEntryRepository;
    
    @Autowired
    private PasswordResetService passwordResetService;
    
    @Autowired
    private LoggingService loggingService;

    @Autowired
    public AdminLogsController(LogEntryRepository logEntryRepository) {
        this.logEntryRepository = logEntryRepository;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<AdminLogDto> getAllLogs() {
        List<LogEntry> logs = logEntryRepository.findAll();
        return logs.stream().map(log -> new AdminLogDto(
                log.getId(),
                log.getProfile() != null ? log.getProfile().getEmail() : null,
                log.getAction(),
                log.getDetails(),
                log.getLoggedAt() != null ? log.getLoggedAt().toString() : null
        )).collect(Collectors.toList());
    }

    @PostMapping("/users/{email}/reset-password")
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resetUserPassword(@PathVariable String email,
                                   @AuthenticationPrincipal UserDetails userDetails) {
        passwordResetService.createPasswordResetToken(email);
        loggingService.logPasswordReset(userDetails.getUsername(), email);
    }
}
