package com.campusconnect.controller;

import com.campusconnect.dto.ApiResponse;
import com.campusconnect.dto.ClubJoinRequest;
import com.campusconnect.entity.Club;
import com.campusconnect.entity.ClubMembership;
import com.campusconnect.security.UserPrincipal;
import com.campusconnect.service.ClubService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clubs")
public class ClubController {

    private final ClubService clubService;

    public ClubController(ClubService clubService) {
        this.clubService = clubService;
    }

    @GetMapping
    public ResponseEntity<List<Club>> getAllClubs() {
        return ResponseEntity.ok(clubService.getAllClubs());
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<ApiResponse> joinClub(
            @PathVariable Long id,
            @RequestBody(required = false) ClubJoinRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        String reason = (request != null) ? request.getReason() : "Cadet membership application";
        ClubMembership membership = clubService.applyForMembership(id, principal.getStudent(), reason);
        return ResponseEntity.ok(new ApiResponse(true, "Membership application submitted! Application ID: " + membership.getId()));
    }
}
