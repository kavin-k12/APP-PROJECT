package com.campusconnect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Event Registration Entity
 * Implements compound uniqueness on (event, student) to prevent duplicate bookings.
 */
@Entity
@Table(name = "event_registrations", uniqueConstraints = {
    @UniqueConstraint(name = "uk_event_student", columnNames = {"event_id", "student_id"})
})
public class EventRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "registration_date", nullable = false)
    private LocalDateTime registrationDate = LocalDateTime.now();

    @Column(nullable = false, length = 30)
    private String status = "CONFIRMED";

    public EventRegistration() {}

    public EventRegistration(Event event, Student student) {
        this.event = event;
        this.student = student;
        this.registrationDate = LocalDateTime.now();
        this.status = "CONFIRMED";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
