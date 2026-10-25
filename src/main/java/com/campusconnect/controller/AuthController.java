package com.campusconnect.controller;

import com.campusconnect.dto.AuthResponse;
import com.campusconnect.dto.LoginRequest;
import com.campusconnect.dto.RegistrationRequest;
import com.campusconnect.dto.StudentResponse;
import com.campusconnect.entity.Student;
import com.campusconnect.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication REST Controller
 * Handles Student Registration, Login, and Session Termination.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegistrationRequest request) {
        Student student = authService.register(request);
        StudentResponse responseDto = new StudentResponse(student);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(true, "Cadet identity initialized successfully in this universe", responseDto));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {
        StudentResponse responseDto = authService.login(request, httpRequest);
        return ResponseEntity.ok(new AuthResponse(true, "Authentication successful. Access granted.", responseDto));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest httpRequest) {
        authService.logout(httpRequest);
        return ResponseEntity.noContent().build();
    }
}
