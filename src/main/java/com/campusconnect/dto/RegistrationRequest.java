package com.campusconnect.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Registration Request DTO with server-side Bean Validation.
 */
public class RegistrationRequest {

    @NotBlank(message = "Cadet name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "College email is required")
    @Email(message = "Must be a valid email format")
    private String email;

    @NotBlank(message = "Student registration number is required")
    @Size(min = 5, max = 50, message = "Registration number must be between 5 and 50 characters")
    private String registrationNumber;

    @NotBlank(message = "Passkey is required")
    @Size(min = 6, max = 100, message = "Passkey must be at least 6 characters")
    private String password;

    private String department;
    private String academicYear;
    private String interests;

    public RegistrationRequest() {}

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public String getInterests() { return interests; }
    public void setInterests(String interests) { this.interests = interests; }
}
