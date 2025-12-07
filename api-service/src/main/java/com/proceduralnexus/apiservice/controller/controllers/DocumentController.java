package com.proceduralnexus.apiservice.controller.controllers;

import com.proceduralnexus.apiservice.business.interfaces.IDocumentService;
import com.proceduralnexus.apiservice.business.services.ProfileService;
import com.proceduralnexus.apiservice.controller.dtos.DocumentResponseDto;
import com.proceduralnexus.apiservice.data.entities.Profile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/documents")
@Tag(name = "Documents", description = "Endpoints for uploading, downloading and managing documents")
public class DocumentController {

    private final IDocumentService documentService;
    private final ProfileService profileService;

    public DocumentController(IDocumentService documentService,
                              ProfileService profileService) {
        this.documentService = documentService;
        this.profileService = profileService;
    }

    /**
     * POST /documents/upload
     * Content-Type: multipart/form-data
     * Params:
     *  - file (MultipartFile)
     *  - batchId (optional)
     */
    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Upload document",
            description = "Uploads a file and stores its metadata in the database.")
    public DocumentResponseDto uploadDocument(
            @RequestPart("file") MultipartFile file,
            @RequestParam(value = "batchId", required = false) String batchId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        // dacă endpoint-ul e protejat și vii cu JWT:
        String email = userDetails.getUsername();
        Profile uploader = profileService.findByEmail(email);

        return documentService.uploadDocument(file, batchId, uploader);
    }

    /**
     * GET /documents
     */
    @GetMapping
    @Operation(
            summary = "List documents",
            description = "Returns a list of all stored documents (metadata only)."
    )
    public List<DocumentResponseDto> listDocuments() {
        return documentService.getDocuments();
    }

    /**
     * GET /documents/{id}
     * Download/view file.
     */
    @GetMapping("/{id}")
    @Operation(
            summary = "Download document",
            description = "Returns the binary content of the document with the given ID."
    )
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        Resource fileResource = documentService.loadDocumentFile(id);
        DocumentResponseDto metadata = documentService.getDocumentMetadata(id);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + metadata.getName() + "\""
                )
                .body(fileResource);
    }

    /**
     * DELETE /documents/{id}
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
            summary = "Delete document",
            description = "Deletes the document with the given ID and its underlying file."
    )
    public void deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
    }
}
