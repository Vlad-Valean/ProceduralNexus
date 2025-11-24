package com.proceduralnexus.apiservice.data.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "esign")
public class ESign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "signer_profile_id", referencedColumnName = "id")
    private Profile signer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "document_id", referencedColumnName = "id")
    private Document document;

    @Lob
    @Column(columnDefinition = "BYTEA", nullable = false)
    private byte[] signature;

    @CreationTimestamp
    @Column(name = "signed_at", updatable = false, nullable = false)
    private Instant signedAt;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Profile getSigner() {
        return signer;
    }

    public void setSigner(Profile signer) {
        this.signer = signer;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public byte[] getSignature() {
        return signature;
    }

    public void setSignature(byte[] signature) {
        this.signature = signature;
    }

    public Instant getSignedAt() {
        return signedAt;
    }

    public void setSignedAt(Instant signedAt) {
        this.signedAt = signedAt;
    }
}
