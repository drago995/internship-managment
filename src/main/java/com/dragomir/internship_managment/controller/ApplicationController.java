package com.dragomir.internship_managment.controller;

import com.dragomir.internship_managment.domain.Application;
import com.dragomir.internship_managment.dto.ApiResponse;
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

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse> apply(
            @RequestBody Map<String, Long> request,
            Authentication auth) {
        Long internshipId = request.get("internshipId");
        Application application = service.apply(internshipId, auth);
        return ResponseEntity.ok(
                new ApiResponse(true, "Uspešno ste se prijavili!", application)
        );
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse> myApplications(Authentication auth) {
        List<Application> applications = service.getApplicationsForStudent(auth);
        return ResponseEntity.ok(
                new ApiResponse(true, "Applications retrieved successfully", applications)
        );
    }

    @GetMapping
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<ApiResponse> getAllApplications() {
        List<Application> applications = service.getAllApplications();
        return ResponseEntity.ok(
                new ApiResponse(true, "All applications retrieved successfully", applications)
        );
    }
}