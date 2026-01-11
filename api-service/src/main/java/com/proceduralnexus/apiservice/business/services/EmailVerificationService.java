package com.proceduralnexus.apiservice.business.services;

import com.proceduralnexus.apiservice.data.entities.EmailVerificationToken;
import com.proceduralnexus.apiservice.data.entities.Profile;
import com.proceduralnexus.apiservice.data.repositories.EmailVerificationTokenRepository;
import com.proceduralnexus.apiservice.data.repositories.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class EmailVerificationService {

    @Autowired
    private EmailVerificationTokenRepository tokenRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private EmailService emailService;

    /**
     * Generate and save a new verification token for the user
     */
    @Transactional
    public String createVerificationToken(UUID userId) {
        // Delete any existing tokens for this user
        tokenRepository.deleteByUserId(userId);
        
        // Generate new token
        String token = UUID.randomUUID().toString();
        Instant expiresAt = Instant.now().plus(24, ChronoUnit.HOURS);
        
        EmailVerificationToken verificationToken = new EmailVerificationToken(userId, token, expiresAt);
        tokenRepository.save(verificationToken);
        
        return token;
    }

    /**
     * Send verification email to user
     */
    public void sendVerificationEmail(UUID userId, String email) {
        String token = createVerificationToken(userId);
        emailService.sendVerificationEmail(email, token);
    }

    /**
     * Verify email with token
     */
    @Transactional
    public VerificationResult verifyEmail(String token) {
        EmailVerificationToken verificationToken = tokenRepository.findByToken(token)
                .orElse(null);

        if (verificationToken == null) {
            return new VerificationResult(false, "Invalid verification token");
        }

        if (verificationToken.isUsed()) {
            return new VerificationResult(false, "This verification link has already been used");
        }

        if (verificationToken.isExpired()) {
            return new VerificationResult(false, "This verification link has expired. Please request a new one");
        }

        // Find the user and mark email as verified
        Profile user = profileRepository.findById(verificationToken.getUserId())
                .orElse(null);

        if (user == null) {
            return new VerificationResult(false, "User not found");
        }

        // Update user and token
        user.setEmailVerified(true);
        verificationToken.setUsed(true);
        
        profileRepository.save(user);
        tokenRepository.save(verificationToken);

        return new VerificationResult(true, "Email verified successfully");
    }

    /**
     * Resend verification email
     */
    @Transactional
    public boolean resendVerificationEmail(String email) {
        Profile user = profileRepository.findByEmail(email).orElse(null);
        
        if (user == null) {
            return false;
        }

        if (user.isEmailVerified()) {
            return false; // Already verified
        }

        sendVerificationEmail(user.getId(), user.getEmail());
        return true;
    }

    /**
     * Result class for verification operations
     */
    public static class VerificationResult {
        private final boolean success;
        private final String message;

        public VerificationResult(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        public boolean isSuccess() {
            return success;
        }

        public String getMessage() {
            return message;
        }
    }
}
