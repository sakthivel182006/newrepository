package com.examly.springapp.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaimTypes {
    
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long claimtypeId;

     @Column(unique = true, nullable = false)
     private String name;
}