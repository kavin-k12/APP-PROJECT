package com.campusconnect.controller;

import com.campusconnect.dto.ApiResponse;
import com.campusconnect.entity.Event;
import com.campusconnect.entity.EventRegistration;
import com.campusconnect.security.UserPrincipal;
import com.campusconnect.service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Events REST Controller
 */
@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<ApiResponse> registerForEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        EventRegistration registration = eventService.registerStudentForEvent(id, principal.getStudent());
        return ResponseEntity.ok(new ApiResponse(true, "Registration confirmed! Booking ID: " + registration.getId()));
    }
}
