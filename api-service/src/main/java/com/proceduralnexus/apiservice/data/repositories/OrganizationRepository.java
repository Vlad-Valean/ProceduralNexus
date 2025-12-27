package com.proceduralnexus.apiservice.data.repositories;

import com.proceduralnexus.apiservice.data.entities.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    boolean existsByName(String name);
}
