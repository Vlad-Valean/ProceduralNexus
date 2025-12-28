package com.proceduralnexus.apiservice.controller.controllers;

import com.proceduralnexus.apiservice.business.interfaces.IDocumentService;
import com.proceduralnexus.apiservice.business.services.ProfileService;
import com.proceduralnexus.apiservice.controller.dtos.DocumentPatchRequest;
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
import java.util.UUID;

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
            @RequestParam("name") String name,
            @RequestParam(value = "batchId", required = false) String batchId,
            @RequestParam("uploaderId") UUID uploaderId
    ) {
        Profile uploader = profileService.findById(uploaderId);
        return documentService.uploadDocument(file, batchId, uploader, name);
    }

    /**
     * GET /documents
     */
    @GetMapping
    @Operation(
            summary = "List documents",
            description = "Returns a list of all stored documents (metadata only)."
    )
    public List<DocumentResponseDto> listDocuments(
            @RequestParam(name = "uploaderId", required = false) UUID uploaderId
    ) {
        return documentService.getDocuments(uploaderId);
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
        Resource file = documentService.loadDocumentFile(id);
        DocumentResponseDto meta = documentService.getDocumentMetadata(id);

        String baseName = meta.getName() == null ? "document" : meta.getName().trim();
        if (baseName.isBlank()) baseName = "document";

        String filename = baseName.toLowerCase().endsWith(".pdf")
                ? baseName
                : baseName + ".pdf";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + filename + "\"; filename*=UTF-8''" + encodeRFC5987(filename))
                .body(file);
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

    @PatchMapping("/{id}")
    @Operation(summary = "Patch document", description = "Patch document fields (currently supports signed).")
    public DocumentResponseDto patchDocument(
            @PathVariable Long id,
            @RequestBody DocumentPatchRequest request
    ) {
        return documentService.patchDocumentSigned(id, request.getSigned());
    }

    private static String encodeRFC5987(String s) {
        byte[] bytes = s.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            int c = b & 0xff;
            if ((c >= 'a' && c <= 'z') ||
                    (c >= 'A' && c <= 'Z') ||
                    (c >= '0' && c <= '9') ||
                    c == '.' || c == '_' || c == '-' ) {
                sb.append((char) c);
            } else {
                sb.append('%');
                String hex = Integer.toHexString(c).toUpperCase();
                if (hex.length() == 1) sb.append('0');
                sb.append(hex);
            }
        }
        return sb.toString();
    }
}
