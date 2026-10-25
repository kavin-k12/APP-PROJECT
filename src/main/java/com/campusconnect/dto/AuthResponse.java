package com.campusconnect.dto;

/**
 * Authentication Response DTO.
 */
public class AuthResponse {

    private boolean success;
    private String message;
    private StudentResponse student;

    public AuthResponse() {}

    public AuthResponse(boolean success, String message, StudentResponse student) {
        this.success = success;
        this.message = message;
        this.student = student;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public StudentResponse getStudent() { return student; }
    public void setStudent(StudentResponse student) { this.student = student; }
}
