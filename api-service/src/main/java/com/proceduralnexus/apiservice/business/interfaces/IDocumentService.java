package com.proceduralnexus.apiservice.business.interfaces;

import com.proceduralnexus.apiservice.controller.dtos.DocumentResponseDto;
import com.proceduralnexus.apiservice.data.entities.Profile;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface IDocumentService {
    DocumentResponseDto uploadDocument(MultipartFile file, String batchId, Profile uploader);
    List<DocumentResponseDto> getDocuments(UUID uploaderId);
    DocumentResponseDto getDocumentMetadata(Long id);
    Resource loadDocumentFile(Long id);
    void deleteDocument(Long id);
    DocumentResponseDto signDocument(Long id);
    DocumentResponseDto patchDocumentSigned(Long id, Boolean signed);
}

