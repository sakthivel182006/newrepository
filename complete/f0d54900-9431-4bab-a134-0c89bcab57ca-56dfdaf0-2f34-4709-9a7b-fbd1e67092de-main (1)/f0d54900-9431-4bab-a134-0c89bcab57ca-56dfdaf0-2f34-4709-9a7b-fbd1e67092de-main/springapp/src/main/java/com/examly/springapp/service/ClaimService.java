package com.examly.springapp.service;

import com.examly.springapp.exception.ValidationException;
import com.examly.springapp.model.Claim;
import com.examly.springapp.repository.ClaimRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ClaimService {

    @Autowired
    private ClaimRepository claimRepository;

    public Claim submitClaim(Claim claim) {
        if (claim.getClaimType() == null || claim.getClaimType().isBlank() ||
        claim.getClaimAmount() == null || claim.getClaimAmount() <= 0 ||
        claim.getIncidentDate() == null || claim.getDescription() == null || claim.getDescription().isBlank()) {
        throw new ValidationException("Missing or invalid required fields");
        }

        claim.setStatus("SUBMITTED");
        claim.setSubmissionDate(LocalDate.now());
        return claimRepository.save(claim);
        }

        public List<Claim> getAllClaims() {
        return claimRepository.findAll();
        }

        public Claim getClaimById(Long id) {
        return claimRepository.findById(id)
            .orElseThrow(() -> new ValidationException("Claim not found"));
            }

            public List<Claim> getClaimsByCustomerId(Long customerId) {
            return claimRepository.findByCustomerId(customerId);
            }

            public Claim updateClaimStatus(Long id, String status) {
            if (!status.equals("APPROVED") && !status.equals("REJECTED") && !status.equals("SUBMITTED")) {
            throw new ValidationException("Invalid claim status");
            }

            Claim claim = getClaimById(id);
            claim.setStatus(status);
            return claimRepository.save(claim);
            }
            }
           