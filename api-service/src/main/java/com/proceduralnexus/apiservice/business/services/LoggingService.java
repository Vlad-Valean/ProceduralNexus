package com.proceduralnexus.apiservice.business.services;

import com.proceduralnexus.apiservice.data.entities.LogEntry;
import com.proceduralnexus.apiservice.data.entities.Profile;
import com.proceduralnexus.apiservice.data.repositories.LogEntryRepository;
import com.proceduralnexus.apiservice.data.repositories.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class LoggingService {
    
    @Autowired
    private LogEntryRepository logEntryRepository;
    
    @Autowired
    private ProfileRepository profileRepository;
    
    public void logAction(String userEmail, String action, String details) {
        try {
            Profile profile = profileRepository.findByEmail(userEmail).orElse(null);
            
            LogEntry logEntry = new LogEntry();
            logEntry.setProfile(profile);
            logEntry.setAction(action);
            logEntry.setDetails(details != null ? details : "");
            
            logEntryRepository.save(logEntry);
        } catch (Exception e) {
            System.err.println("Failed to log action: " + e.getMessage());
        }
    }
    
    public void logDocumentUpload(String uploaderEmail, String recipientEmail, String documentName) {
        logAction(uploaderEmail, "DOCUMENT_UPLOAD", 
            String.format("Uploaded document '%s' for user %s", documentName, recipientEmail));
    }
    
    public void logPasswordReset(String adminEmail, String targetEmail) {
        logAction(adminEmail, "PASSWORD_RESET", 
            String.format("Initiated password reset for user %s", targetEmail));
    }
    
    public void logUserAdded(String hrEmail, String newUserEmail, String organizationName) {
        logAction(hrEmail, "USER_ADDED", 
            String.format("Added user %s to organization %s", newUserEmail, organizationName));
    }
    
    public void logUserRemoved(String hrEmail, String removedUserEmail, String organizationName) {
        logAction(hrEmail, "USER_REMOVED", 
            String.format("Removed user %s from organization %s", removedUserEmail, organizationName));
    }
    
    public void logOrganizationCreated(String creatorEmail, String organizationName) {
        logAction(creatorEmail, "ORGANIZATION_CREATED", 
            String.format("Created organization '%s'", organizationName));
    }
    
    public void logOrganizationDeleted(String deleterEmail, String organizationName) {
        logAction(deleterEmail, "ORGANIZATION_DELETED", 
            String.format("Deleted organization '%s'", organizationName));
    }
    
    public void logApplicationCreated(String applicantEmail, String organizationName) {
        logAction(applicantEmail, "APPLICATION_CREATED", 
            String.format("Created application to organization '%s'", organizationName));
    }
    
    public void logApplicationAccepted(String hrEmail, String applicantEmail, String organizationName) {
        logAction(hrEmail, "APPLICATION_ACCEPTED", 
            String.format("Accepted application from %s to organization '%s'", applicantEmail, organizationName));
    }
    
    public void logApplicationRejected(String hrEmail, String applicantEmail, String organizationName) {
        logAction(hrEmail, "APPLICATION_REJECTED", 
            String.format("Rejected application from %s to organization '%s'", applicantEmail, organizationName));
    }
}
