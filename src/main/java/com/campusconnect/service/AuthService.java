package com.campusconnect.service;

import com.campusconnect.dto.LoginRequest;
import com.campusconnect.dto.RegistrationRequest;
import com.campusconnect.dto.StudentResponse;
import com.campusconnect.entity.Student;
import com.campusconnect.exception.DuplicateResourceException;
import com.campusconnect.repository.StudentRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Authentication and Student Registration Service
 * Enforces business validation, BCrypt password hashing, and session management.
 */
@Service
public class AuthService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            StudentRepository studentRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public Student register(RegistrationRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (studentRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateResourceException("Email address is already initialized in this universe");
        }

        String normalizedReg = request.getRegistrationNumber().trim().toUpperCase();
        if (studentRepository.existsByRegistrationNumber(normalizedReg)) {
            throw new DuplicateResourceException("Student registration number is already initialized");
        }

        Student student = new Student();
        student.setName(request.getName().trim());
        student.setEmail(normalizedEmail);
        student.setRegistrationNumber(normalizedReg);
        student.setDepartment(request.getDepartment());
        student.setAcademicYear(request.getAcademicYear());
        student.setInterests(request.getInterests());

        // BCrypt hashing
        student.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        student.setRole("ROLE_STUDENT");
        student.setEnabled(true);

        return studentRepository.save(student);
    }

    public StudentResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        // Delegate to Spring Security AuthenticationManager
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
        );

        SecurityContext securityContext = SecurityContextHolder.getContext();
        securityContext.setAuthentication(authentication);

        // Store authentication token in HTTP session for persistent cookie session
        HttpSession session = httpRequest.getSession(true);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);

        Student student = studentRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("Cadet not found"));

        return new StudentResponse(student);
    }

    public void logout(HttpServletRequest httpRequest) {
        SecurityContextHolder.clearContext();
        HttpSession session = httpRequest.getSession(false);
        if (session != null) {
            session.invalidate();
        }
    }
}
