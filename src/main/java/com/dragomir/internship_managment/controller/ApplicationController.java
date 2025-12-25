package com.dragomir.internship_managment.controller;

import com.dragomir.internship_managment.domain.Application;
import com.dragomir.internship_managment.dto.ApiResponse;
import com.dragomir.internship_managment.dto.ApplicationDTO;
import com.dragomir.internship_managment.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService service;

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse> getApplicationsByStudent(Authentication auth) {
        List<ApplicationDTO> applications = service.getApplicationsByStudent(auth);
        return ResponseEntity.ok(new ApiResponse(true, "Applications retrieved successfully", applications));
    }

    @PostMapping("/{internshipId}/apply")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse> apply(@PathVariable Long internshipId, Authentication auth) {
        Application application = service.apply(internshipId, auth);
        return ResponseEntity.ok(new ApiResponse(true, "Application submitted successfully", application));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<ApiResponse> approve(@PathVariable Long id) {
        Application application = service.approve(id);
        return ResponseEntity.ok(new ApiResponse(true, "Application approved", application));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<ApiResponse> reject(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.get("reason") : null;
        Application application = service.reject(id, reason);
        return ResponseEntity.ok(new ApiResponse(true, "Application rejected", application));
    }



}
