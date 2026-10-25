package com.campusconnect;

import com.campusconnect.dto.RegistrationRequest;
import com.campusconnect.entity.Student;
import com.campusconnect.exception.DuplicateResourceException;
import com.campusconnect.repository.StudentRepository;
import com.campusconnect.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private RegistrationRequest sampleRequest;

    @BeforeEach
    void setUp() {
        sampleRequest = new RegistrationRequest();
        sampleRequest.setName("Alexander Vance");
        sampleRequest.setEmail("alex.vance@srmist.edu.in");
        sampleRequest.setRegistrationNumber("RA2511009990001");
        sampleRequest.setPassword("SecretPass@2030");
        sampleRequest.setDepartment("Artificial Intelligence");
        sampleRequest.setAcademicYear("Year 1 Alpha");
    }

    @Test
    @DisplayName("Should successfully register student and hash password with BCrypt")
    void testSuccessfulRegistration() {
        Student registered = authService.register(sampleRequest);

        assertNotNull(registered.getId());
        assertEquals("alex.vance@srmist.edu.in", registered.getEmail());
        assertEquals("RA2511009990001", registered.getRegistrationNumber());
        assertNotEquals("SecretPass@2030", registered.getPasswordHash());
        assertTrue(passwordEncoder.matches("SecretPass@2030", registered.getPasswordHash()));
    }

    @Test
    @DisplayName("Should reject duplicate email registration with DuplicateResourceException")
    void testDuplicateEmailRejection() {
        authService.register(sampleRequest);

        RegistrationRequest duplicateEmailReq = new RegistrationRequest();
        duplicateEmailReq.setName("Different Person");
        duplicateEmailReq.setEmail("alex.vance@srmist.edu.in"); // duplicate email
        duplicateEmailReq.setRegistrationNumber("RA2511009990002");
        duplicateEmailReq.setPassword("AnotherPass123");

        assertThrows(DuplicateResourceException.class, () -> {
            authService.register(duplicateEmailReq);
        });
    }

    @Test
    @DisplayName("Should reject duplicate student registration number")
    void testDuplicateRegistrationNumberRejection() {
        authService.register(sampleRequest);

        RegistrationRequest duplicateRegReq = new RegistrationRequest();
        duplicateRegReq.setName("Different Person");
        duplicateRegReq.setEmail("different.email@srmist.edu.in");
        duplicateRegReq.setRegistrationNumber("RA2511009990001"); // duplicate reg number
        duplicateRegReq.setPassword("AnotherPass123");

        assertThrows(DuplicateResourceException.class, () -> {
            authService.register(duplicateRegReq);
        });
    }
}
