package com.campusconnect.controller;

import com.campusconnect.dto.JavaLabModuleDTO;
import com.campusconnect.service.JavaLabService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/javalab")
public class JavaLabController {

    private final JavaLabService javaLabService;

    public JavaLabController(JavaLabService javaLabService) {
        this.javaLabService = javaLabService;
    }

    @GetMapping("/modules")
    public ResponseEntity<List<JavaLabModuleDTO>> getModules() {
        return ResponseEntity.ok(javaLabService.getModules());
    }
}
