package com.proceduralnexus.apiservice.business.services;

import com.proceduralnexus.apiservice.business.interfaces.IUserActivityService;
import com.proceduralnexus.apiservice.data.entities.LogEntry;
import com.proceduralnexus.apiservice.data.entities.Profile;
import com.proceduralnexus.apiservice.data.repositories.LogEntryRepository;
import com.proceduralnexus.apiservice.data.repositories.ProfileRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class UserActivityService implements IUserActivityService {

    private final LogEntryRepository logRepo;
    private final ProfileRepository profileRepo;

    public UserActivityService(LogEntryRepository logRepo, ProfileRepository profileRepo) {
        this.logRepo = logRepo;
        this.profileRepo = profileRepo;
    }

    @Override
    public LogEntry logActivity(UUID userId, String userEmail, String action, String description) {
        Profile profile = null;
        if (userId != null) {
            try {
                profile = profileRepo.findById(userId).orElse(null);
            } catch (Exception ignored) {}
        }
        if (profile == null && userEmail != null) {
            profile = profileRepo.findByEmail(userEmail).orElse(null);
        }

        if (profile == null) {
            return null;
        }

        LogEntry e = new LogEntry();
        e.setProfile(profile);
        e.setAction(action);
        e.setDetails(description);
        e.setLoggedAt(Instant.now());

        return logRepo.save(e);
    }

    @Override
    public List<LogEntry> getAllActivities() {
        return logRepo.findAll();
    }

    @Override
    public List<LogEntry> getActivitiesForUser(UUID userId) {
        return logRepo.findByProfile_Id(userId);
    }

    @Override
    public List<LogEntry> searchByEmail(String emailFragment) {
        return logRepo.findByProfile_EmailContainingIgnoreCase(emailFragment);
    }

    @Override
    public List<LogEntry> getActivitiesForOrganization(Long organizationId) {
        return logRepo.findByProfile_Organization_Id(organizationId);
    }
}
