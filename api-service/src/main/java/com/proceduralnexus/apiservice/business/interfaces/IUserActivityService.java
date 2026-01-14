package com.proceduralnexus.apiservice.business.interfaces;

import com.proceduralnexus.apiservice.data.entities.LogEntry;
import java.util.List;
import java.util.UUID;

public interface IUserActivityService {
    LogEntry logActivity(UUID userId, String userEmail, String action, String description);
    List<LogEntry> getAllActivities();
    List<LogEntry> getActivitiesForUser(UUID userId);
    List<LogEntry> searchByEmail(String emailFragment);
    List<LogEntry> getActivitiesForOrganization(Long organizationId);
}
