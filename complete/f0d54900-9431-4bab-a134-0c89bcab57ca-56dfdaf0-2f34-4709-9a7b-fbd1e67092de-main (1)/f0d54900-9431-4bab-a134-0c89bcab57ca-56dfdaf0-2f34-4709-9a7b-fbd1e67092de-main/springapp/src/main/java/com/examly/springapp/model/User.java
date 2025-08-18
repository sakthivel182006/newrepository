package com.examly.springapp.model;
import com.examly.springapp.enumclass.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@Email(message = "Email should be valid")
@NotBlank(message = "Email is mandatory")
@Column(unique = true)
private String email;

@NotBlank(message = "Password is mandatory")
@Size(min = 6, message = "Password must be at least 6 characters")
private String password;

private boolean verified = false;

private String verificationToken;

@Enumerated(EnumType.STRING)
@Column(nullable = false)
private UserRole role = UserRole.CUSTOMER;

}
