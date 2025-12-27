package com.proceduralnexus.apiservice.data.repositories;

import com.proceduralnexus.apiservice.data.entities.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByOrganization_IdAndStatusOrderByCreatedAtDesc(Long organizationId, Application.ApplicationStatus status);
    Optional<Application> findByApplicant_IdAndOrganization_Id(UUID profileId, Long organizationId);
}
