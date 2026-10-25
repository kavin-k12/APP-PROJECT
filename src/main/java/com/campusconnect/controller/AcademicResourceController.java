package com.campusconnect.controller;

import com.campusconnect.entity.AcademicResource;
import com.campusconnect.service.AcademicResourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class AcademicResourceController {

    private final AcademicResourceService resourceService;

    public AcademicResourceController(AcademicResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping
    public ResponseEntity<List<AcademicResource>> getResources(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String semester) {
        return ResponseEntity.ok(resourceService.getResources(department, semester));
    }
}
