package com.proceduralnexus.apiservice.controller.controllers;

import com.proceduralnexus.apiservice.business.interfaces.IUserActivityService;
import com.proceduralnexus.apiservice.controller.dtos.ActivityResponseDto;
import com.proceduralnexus.apiservice.controller.dtos.LogRequest;
import com.proceduralnexus.apiservice.data.entities.LogEntry;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ActivityController {

    private final IUserActivityService activityService;

    public ActivityController(IUserActivityService activityService) {
        this.activityService = activityService;
    }

    @PostMapping("/logs")
    public ResponseEntity<?> createLog(@AuthenticationPrincipal UserDetails userDetails, @RequestBody LogRequest req) {
        if (userDetails == null) return ResponseEntity.status(401).build();

        boolean isAdmin = userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) {
            // Do not record admin actions via this endpoint
            return ResponseEntity.ok().build();
        }

        // userDetails.getUsername() should return email
        // Try to parse user id from principal if available (custom UserDetailsImpl)
        UUID userId = null;
        try {
            var impl = (com.proceduralnexus.apiservice.security.UserDetailsImpl) userDetails;
            userId = impl.getId();
        } catch (Exception ignored) {}

        activityService.logActivity(userId, userDetails.getUsername(), req.getAction(), req.getDescription());
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/logs")
    public List<ActivityResponseDto> listAll(@RequestParam(name = "q", required = false) String q) {
        List<LogEntry> entries = (q == null || q.isBlank()) ? activityService.getAllActivities() : activityService.searchByEmail(q);
        return entries.stream().map(this::toDto).collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/logs/user/{userId}")
    public List<ActivityResponseDto> listForUser(@PathVariable UUID userId) {
        List<LogEntry> entries = activityService.getActivitiesForUser(userId);
        return entries.stream().map(this::toDto).collect(Collectors.toList());
    }

    private ActivityResponseDto toDto(LogEntry e) {
        ActivityResponseDto d = new ActivityResponseDto();
        d.setId(e.getId());
        d.setAction(e.getAction());
        d.setDescription(e.getDetails());
        d.setCreatedAt(e.getLoggedAt());
        if (e.getProfile() != null) {
            d.setUserEmail(e.getProfile().getEmail());
            d.setUserId(e.getProfile().getId() != null ? e.getProfile().getId().toString() : null);
        }
        return d;
    }
}
