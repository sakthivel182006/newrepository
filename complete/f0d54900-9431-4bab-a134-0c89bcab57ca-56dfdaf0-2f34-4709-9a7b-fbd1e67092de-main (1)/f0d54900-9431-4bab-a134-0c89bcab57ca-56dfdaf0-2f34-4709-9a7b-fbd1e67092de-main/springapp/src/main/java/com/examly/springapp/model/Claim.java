package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data

public class Claim {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@NotNull(message = "Customer ID is required")
private Long customerId;

@NotBlank(message = "Claim type is mandatory")
private String claimType;

@NotNull(message = "Claim amount is required")
@DecimalMin(value = "0.0", inclusive = false, message = "Claim amount must be positive")
private Double claimAmount;

@NotNull(message = "Incident date is required")
private LocalDate incidentDate;

@NotBlank(message = "Description is required")
private String description;

private String status;
private LocalDate submissionDate;

public Claim() {}

public Claim(Long id, Long customerId, String claimType, Double claimAmount,
     LocalDate incidentDate, String description, String status, LocalDate submissionDate) {
     this.id = id;
     this.customerId = customerId;
     this.claimType = claimType;
     this.claimAmount = claimAmount;
     this.incidentDate = incidentDate;
     this.description = description;
     this.status = status;
     this.submissionDate = submissionDate;
     }
}