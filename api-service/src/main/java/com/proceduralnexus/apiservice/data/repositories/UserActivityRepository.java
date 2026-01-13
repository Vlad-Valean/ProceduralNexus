package com.proceduralnexus.apiservice.data.repositories;

import com.proceduralnexus.apiservice.data.entities.UserActivity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserActivityRepository extends JpaRepository<UserActivity, UUID> {
    List<UserActivity> findByUserEmailContainingIgnoreCase(String email);
    List<UserActivity> findByUserId(UUID userId);
}
