package com.examly.springapp.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Claimdocuments {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "claims_id", nullable = false)
    private Claims claimId;

    @ManyToOne
    @JoinColumn(name = "users_id", nullable = false)
    private User customer;

    @Column(name = "document_name", nullable = false)
    private String document_name;

    @Column(name = "file_url", nullable = false)
    private String file_url;
    
}
