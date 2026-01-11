package com.proceduralnexus.apiservice.data.repositories;

import com.proceduralnexus.apiservice.data.entities.EmailVerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {
    
    Optional<EmailVerificationToken> findByToken(String token);
    
    Optional<EmailVerificationToken> findByUserId(UUID userId);
    
    void deleteByUserId(UUID userId);
}
