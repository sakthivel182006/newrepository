package com.examly.springapp.controller;

import java.time.LocalDate;

import lombok.Data;

@Data
public class ClaimDTO {
    private Long customerId;
    private Long claimtypeId;
    private Double claimAmount;
    private LocalDate incidentDate;
    private String description;
    private String status; // optional
    private LocalDate submissionDate; // optional
}
