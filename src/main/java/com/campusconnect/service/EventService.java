package com.campusconnect.service;

import com.campusconnect.entity.Event;
import com.campusconnect.entity.EventRegistration;
import com.campusconnect.entity.Student;
import com.campusconnect.exception.BadRequestException;
import com.campusconnect.exception.DuplicateResourceException;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.EventRegistrationRepository;
import com.campusconnect.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Event and Registration Service
 * Manages event lifecycle, capacity verification, and transactional booking.
 */
@Service
public class EventService {

    private final EventRepository eventRepository;
    private final EventRegistrationRepository registrationRepository;

    public EventService(
            EventRepository eventRepository,
            EventRegistrationRepository registrationRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAllByOrderByEventDateAsc();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));
    }

    @Transactional
    public EventRegistration registerStudentForEvent(Long eventId, Student student) {
        Event event = getEventById(eventId);

        if (!"OPEN".equalsIgnoreCase(event.getStatus())) {
            throw new BadRequestException("Event registration is currently closed or capacity full");
        }

        if (registrationRepository.existsByEventAndStudent(event, student)) {
            throw new DuplicateResourceException("You are already registered for this event");
        }

        if (event.getRegisteredCount() >= event.getCapacity()) {
            event.setStatus("FULL");
            eventRepository.save(event);
            throw new BadRequestException("Event capacity reached (" + event.getCapacity() + " maximum)");
        }

        // Increment count transactionally
        event.setRegisteredCount(event.getRegisteredCount() + 1);
        if (event.getRegisteredCount() >= event.getCapacity()) {
            event.setStatus("FULL");
        }
        eventRepository.save(event);

        EventRegistration registration = new EventRegistration();
        registration.setEvent(event);
        registration.setStudent(student);
        registration.setRegistrationDate(LocalDateTime.now());
        registration.setStatus("CONFIRMED");

        return registrationRepository.save(registration);
    }

    public List<EventRegistration> getStudentRegistrations(Student student) {
        return registrationRepository.findByStudentOrderByRegistrationDateDesc(student);
    }
}
