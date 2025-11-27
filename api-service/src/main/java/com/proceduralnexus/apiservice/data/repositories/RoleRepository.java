package com.proceduralnexus.apiservice.data.repositories;

import com.proceduralnexus.apiservice.data.entities.Role;
import com.proceduralnexus.apiservice.data.entities.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}
