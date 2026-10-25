package com.campusconnect.controller;

import com.campusconnect.dto.ApiResponse;
import com.campusconnect.dto.LostFoundRequest;
import com.campusconnect.entity.LostFoundItem;
import com.campusconnect.security.UserPrincipal;
import com.campusconnect.service.LostFoundService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lost-found")
public class LostFoundController {

    private final LostFoundService lostFoundService;

    public LostFoundController(LostFoundService lostFoundService) {
        this.lostFoundService = lostFoundService;
    }

    @GetMapping
    public ResponseEntity<List<LostFoundItem>> getItems(@RequestParam(required = false) String type) {
        return ResponseEntity.ok(lostFoundService.getItems(type));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> reportItem(
            @Valid @RequestBody LostFoundRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        LostFoundItem item = lostFoundService.reportItem(request, principal != null ? principal.getStudent() : null);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Item report logged with Subspace ID: " + item.getId()));
    }
}
