package com.campusconnect.dto;

import com.campusconnect.entity.Student;

/**
 * Dedicated Safe Student Response DTO.
 * Excludes sensitive fields like password hashes.
 */
public class StudentResponse {

    private Long id;
    private String name;
    private String email;
    private String registrationNumber;
    private String department;
    private String academicYear;
    private String interests;
    private String role;

    public StudentResponse() {}

    public StudentResponse(Student student) {
        if (student != null) {
            this.id = student.getId();
            this.name = student.getName();
            this.email = student.getEmail();
            this.registrationNumber = student.getRegistrationNumber();
            this.department = student.getDepartment();
            this.academicYear = student.getAcademicYear();
            this.interests = student.getInterests();
            this.role = student.getRole();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public String getInterests() { return interests; }
    public void setInterests(String interests) { this.interests = interests; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
