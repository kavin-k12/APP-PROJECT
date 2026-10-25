package com.campusconnect.repository;

import com.campusconnect.entity.AcademicResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AcademicResourceRepository extends JpaRepository<AcademicResource, Long> {

    List<AcademicResource> findByDepartmentIgnoreCase(String department);

    List<AcademicResource> findBySemesterIgnoreCase(String semester);

    List<AcademicResource> findByDepartmentIgnoreCaseAndSemesterIgnoreCase(String department, String semester);
}
