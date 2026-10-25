package com.campusconnect.service;

import com.campusconnect.entity.AcademicResource;
import com.campusconnect.repository.AcademicResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AcademicResourceService {

    private final AcademicResourceRepository resourceRepository;

    public AcademicResourceService(AcademicResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public List<AcademicResource> getResources(String department, String semester) {
        boolean hasDept = department != null && !department.isBlank();
        boolean hasSem = semester != null && !semester.isBlank();

        if (hasDept && hasSem) {
            return resourceRepository.findByDepartmentIgnoreCaseAndSemesterIgnoreCase(department, semester);
        } else if (hasDept) {
            return resourceRepository.findByDepartmentIgnoreCase(department);
        } else if (hasSem) {
            return resourceRepository.findBySemesterIgnoreCase(semester);
        } else {
            return resourceRepository.findAll();
        }
    }
}
