package com.campusconnect;

import com.campusconnect.entity.Event;
import com.campusconnect.entity.EventRegistration;
import com.campusconnect.entity.Student;
import com.campusconnect.exception.BadRequestException;
import com.campusconnect.exception.DuplicateResourceException;
import com.campusconnect.repository.EventRepository;
import com.campusconnect.repository.StudentRepository;
import com.campusconnect.service.EventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class EventServiceTest {

    @Autowired
    private EventService eventService;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private StudentRepository studentRepository;

    private Event testEvent;
    private Student testStudent;

    @BeforeEach
    void setUp() {
        testEvent = new Event(
                "Starlight Robotics Workshop",
                "Autonomous telemetry and rover calibration.",
                "Workshop",
                LocalDateTime.now().plusDays(10),
                "Dome Beta",
                2, // Low capacity to test capacity limits
                0,
                "OPEN"
        );
        testEvent = eventRepository.save(testEvent);

        testStudent = new Student(
                "Elena Rostova",
                "elena.r@srmist.edu.in",
                "RA2511009990099",
                "$2a$10$encryptedhashvalue",
                "Robotics",
                "Year 2 Beta",
                "Autonomous Navigation"
        );
        testStudent = studentRepository.save(testStudent);
    }

    @Test
    @DisplayName("Should successfully register student for an event")
    void testSuccessfulEventRegistration() {
        EventRegistration registration = eventService.registerStudentForEvent(testEvent.getId(), testStudent);

        assertNotNull(registration.getId());
        assertEquals("CONFIRMED", registration.getStatus());

        Event updatedEvent = eventRepository.findById(testEvent.getId()).orElseThrow();
        assertEquals(1, updatedEvent.getRegisteredCount());
    }

    @Test
    @DisplayName("Should reject duplicate registration for the same event and student")
    void testDuplicateEventRegistration() {
        eventService.registerStudentForEvent(testEvent.getId(), testStudent);

        assertThrows(DuplicateResourceException.class, () -> {
            eventService.registerStudentForEvent(testEvent.getId(), testStudent);
        });
    }

    @Test
    @DisplayName("Should reject registration when event capacity is reached")
    void testEventCapacityLimit() {
        Student secondStudent = new Student("Marcus Chen", "marcus.c@srmist.edu.in", "RA2511009990098", "hash", "CS", "Year 1", "");
        secondStudent = studentRepository.save(secondStudent);

        Student thirdStudent = new Student("Aria Vance", "aria.v@srmist.edu.in", "RA2511009990097", "hash", "AI", "Year 1", "");
        thirdStudent = studentRepository.save(thirdStudent);

        // Fill capacity (limit is 2)
        eventService.registerStudentForEvent(testEvent.getId(), testStudent);
        eventService.registerStudentForEvent(testEvent.getId(), secondStudent);

        // Third student attempts registration on full event
        Student finalThirdStudent = thirdStudent;
        assertThrows(BadRequestException.class, () -> {
            eventService.registerStudentForEvent(testEvent.getId(), finalThirdStudent);
        });
    }
}
