package com.dragomir.internship_managment.controller;

import com.dragomir.internship_managment.domain.Internship;
import com.dragomir.internship_managment.dto.ApiResponse;
import com.dragomir.internship_managment.service.InternshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    // 1️⃣ Vrati filtrirane prakse (sa paginacijom i filterima)
    @GetMapping
    public ResponseEntity<ApiResponse> getFilteredInternships(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "limit", defaultValue = "5") int limit,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "company", required = false) String company,
            @RequestParam(value = "weeksDuration", required = false) Integer weeksDuration,
            @RequestParam(value = "isPaid", required = false) Boolean isPaid
    ) {
        var result = internshipService.getFilteredInternships(page, limit, search, location, company, weeksDuration, isPaid);
        return ResponseEntity.ok(new ApiResponse(true, "Internships retrieved successfully", result));
    }

    // 2️⃣ Vrati jednu praksu po ID-u
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getInternshipById(@PathVariable Long id) {
        var internship = internshipService.getInternshipById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Internship retrieved successfully", internship));
    }

    // 3️⃣ Kreiraj novu praksu (COMPANY only)
    @PostMapping
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<ApiResponse> createInternship(@RequestBody Internship offer, Authentication auth) {
        Internship saved = internshipService.createOfferByUser(offer, auth);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Internship created successfully", saved));
    }
}
