package com.proceduralnexus.apiservice.data.repositories;

import com.proceduralnexus.apiservice.data.entities.Document;
import com.proceduralnexus.apiservice.data.entities.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByUploader_Id(UUID uploaderId);
}
