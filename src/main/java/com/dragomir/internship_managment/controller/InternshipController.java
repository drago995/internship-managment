package com.dragomir.internship_managment.controller;

import com.dragomir.internship_managment.domain.Internship;
import com.dragomir.internship_managment.dto.ApiResponse;
import com.dragomir.internship_managment.service.InternshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/internships")
public class InternshipController {

    private final InternshipService internshipService;

    @Autowired
    public InternshipController(InternshipService internshipService) {
        this.internshipService = internshipService;
    }

    // Any authenticated user can view internships
    @GetMapping
    public ResponseEntity<ApiResponse> getAllInternships() {
        List<Internship> internships = internshipService.getAllInternships();
        return ResponseEntity.ok(
                new ApiResponse(true, "Internships retrieved successfully", internships)
        );
    }

    // Only COMPANY can create
    @PostMapping
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<ApiResponse> createInternship(
            @RequestBody Internship offer,
            Authentication auth) {
        Internship saved = internshipService.createOfferByUser(offer, auth);
        return ResponseEntity.ok(
                new ApiResponse(true, "Internship created successfully", saved)
        );
    }
}