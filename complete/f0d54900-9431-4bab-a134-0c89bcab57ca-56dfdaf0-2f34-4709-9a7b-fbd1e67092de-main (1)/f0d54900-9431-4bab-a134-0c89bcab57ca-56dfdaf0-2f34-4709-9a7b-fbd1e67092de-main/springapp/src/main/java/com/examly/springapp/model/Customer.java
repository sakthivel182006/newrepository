package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long customerId;

@NotBlank(message = "Name is mandatory")
private String name;

@Email(message = "Email should be valid")
private String email;

@Pattern(regexp = "\\d{10}", message = "Phone number must be 10 digits")
private String phoneNumber;

private String policyNumber;
}
