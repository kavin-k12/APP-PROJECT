package com.campusconnect.service;

import com.campusconnect.dto.JavaLabModuleDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class JavaLabService {

    public List<JavaLabModuleDTO> getModules() {
        List<JavaLabModuleDTO> list = new ArrayList<>();

        list.add(new JavaLabModuleDTO(
                "student-registration",
                "Student Registration",
                "Security & Auth",
                "Transactional registration workflow with duplicate validation, BCrypt password hashing, and DTO projection.",
                "src/main/java/com/campusconnect/service/AuthService.java",
                "AuthService.java",
                "POST /api/auth/register",
                "// See AuthService.java for full implementation\n@Transactional\npublic Student register(RegistrationRequest request) {\n    // Implementation details\n}",
                "START\n1. Receive registration request\n2. Validate required fields\n3. Check duplicate email and student number\n4. Hash password with BCrypt\n5. Save student entity in MySQL\n6. Return safe StudentResponse DTO\nEND",
                "Enterprise registration workflow enforcing uniqueness constraints and BCrypt cryptographic salting."
        ));

        list.add(new JavaLabModuleDTO(
                "event-registration",
                "Event Registration",
                "Academic Life",
                "Transactional registration with capacity enforcement, duplicate check, and concurrency protection.",
                "src/main/java/com/campusconnect/service/EventService.java",
                "EventService.java",
                "POST /api/events/{id}/register",
                "// See EventService.java for full implementation\n@Transactional\npublic EventRegistration registerStudentForEvent(Long eventId, Student student) {\n    // Concurrency and capacity checks\n}",
                "START\n1. Receive event ID and student principal\n2. Find event\n3. Check open status and duplicate registration\n4. Check capacity limits\n5. Increment registeredCount\n6. Persist EventRegistration record\nEND",
                "ACID transaction model preventing race conditions during simultaneous registration."
        ));

        return list;
    }
}
