package com.proceduralnexus.apiservice.business.services;

import com.proceduralnexus.apiservice.business.interfaces.IDocumentService;
import com.proceduralnexus.apiservice.controller.dtos.DocumentResponseDto;
import com.proceduralnexus.apiservice.data.entities.Document;
import com.proceduralnexus.apiservice.data.entities.Profile;
import com.proceduralnexus.apiservice.data.repositories.DocumentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DocumentService implements IDocumentService {

    private final DocumentRepository documentRepository;
    private final Path fileStorageLocation;
    private final EmailService emailService;

    public DocumentService(
            DocumentRepository documentRepository,
            EmailService emailService,
            @Value("${app.documents.storage-path:uploads}") String storagePath
    ) {
        this.documentRepository = documentRepository;
        this.emailService = emailService;

        this.fileStorageLocation = Paths.get(storagePath)
                .toAbsolutePath()
                .normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @Override
    public DocumentResponseDto uploadDocument(
            MultipartFile file,
            String batchId,
            Profile uploader,
            String name,
            String type
    ) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Uploaded file is empty");
        }

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        if (originalFileName == null || originalFileName.isBlank()) {
            originalFileName = "document.pdf";
        }

        Document.DocumentType docType = Document.DocumentType.OTHER;
        if (type != null && !type.isBlank()) {
            try {
                docType = Document.DocumentType.valueOf(type.trim().toUpperCase());
            } catch (IllegalArgumentException ignored) {
            }
        }

        String displayName = (name == null) ? "" : name.trim();
        if (displayName.isBlank()) {
            displayName = originalFileName;
        }

        displayName = displayName.replaceAll("(?i)\\.pdf$", "").trim();
        if (displayName.isBlank()) {
            displayName = "document";
        }

        String storedFileName = UUID.randomUUID() + "_" + originalFileName;
        Path targetLocation = this.fileStorageLocation.resolve(storedFileName);

        try {
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Could not store file. Please try again.",
                    ex
            );
        }

        Document document = new Document();
        document.setName(displayName);
        document.setFilePath(targetLocation.toString());
        document.setFileSizeInBytes(file.getSize());
        document.setBatchId(batchId);
        document.setUploader(uploader);
        document.setSigned(false);
        document.setType(docType);

        Document saved = documentRepository.save(document);
        return toDto(saved);
    }

    @Override
    public List<DocumentResponseDto> getDocuments(UUID uploaderId) {
        List<Document> docs = (uploaderId == null)
                ? documentRepository.findAll()
                : documentRepository.findByUploader_Id(uploaderId);

        return docs.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public DocumentResponseDto patchDocumentSigned(Long id, Boolean signed) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found")
                );

        boolean previouslyUnsigned = !document.isSigned();
        
        if (signed != null) {
            document.setSigned(signed);
        }

        Document saved = documentRepository.save(document);
        
        // Send email notification when document is signed/approved
        if (signed != null && signed && previouslyUnsigned) {
            try {
                Profile uploader = saved.getUploader();
                if (uploader != null) {
                    String userName = uploader.getFirstname() + " " + uploader.getLastname();
                    emailService.sendDocumentApprovedEmail(uploader.getEmail(), userName, saved.getName());
                }
            } catch (Exception e) {
                System.err.println("Failed to send document approved email: " + e.getMessage());
            }
        }
        
        // Send email notification when document is unsigned/requires changes
        if (signed != null && !signed && !previouslyUnsigned) {
            try {
                Profile uploader = saved.getUploader();
                if (uploader != null) {
                    String userName = uploader.getFirstname() + " " + uploader.getLastname();
                    emailService.sendDocumentRequiresChangesEmail(uploader.getEmail(), userName, saved.getName(), null);
                }
            } catch (Exception e) {
                System.err.println("Failed to send document requires changes email: " + e.getMessage());
            }
        }
        
        return toDto(saved);
    }

    @Override
    public DocumentResponseDto getDocumentMetadata(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found")
                );
        return toDto(document);
    }

    @Override
    public Resource loadDocumentFile(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found")
                );

        try {
            Path filePath = Paths.get(document.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found on disk");
            }
        } catch (MalformedURLException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error while loading file", ex);
        }
    }

    @Override
    public void deleteDocument(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found")
                );
        documentRepository.delete(document);
    }

    private DocumentResponseDto toDto(Document document) {
        DocumentResponseDto dto = new DocumentResponseDto();
        dto.setId(document.getId());
        dto.setName(document.getName());
        dto.setFileSizeInBytes(document.getFileSizeInBytes());
        dto.setBatchId(document.getBatchId());
        dto.setSigned(document.isSigned());
        dto.setCreatedAt(document.getCreatedAt());
        dto.setUpdatedAt(document.getUpdatedAt());
        dto.setFilePath(document.getFilePath());
        dto.setType(document.getType() != null ? document.getType().name() : "OTHER");

        if (document.getUploader() != null) {
            dto.setUploaderId(document.getUploader().getId().toString());
            dto.setUploaderEmail(document.getUploader().getEmail());
        }

        return dto;
    }
    @Override
    public DocumentResponseDto signDocument(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found")
                );
        document.setSigned(true);
        Document saved = documentRepository.save(document);
        return toDto(saved);
    }
}
