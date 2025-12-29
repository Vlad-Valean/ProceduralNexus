package com.proceduralnexus.apiservice.data.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proceduralnexus.apiservice.data.entities.Application;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByOrganization_IdAndStatusOrderByCreatedAtDesc(Long organizationId, Application.ApplicationStatus status);
    Optional<Application> findByApplicant_IdAndOrganization_Id(UUID profileId, Long organizationId);
    List<Application> findByApplicant_IdOrderByCreatedAtDesc(UUID applicantId);
    void deleteByApplicant_Id(UUID applicantId);
}
