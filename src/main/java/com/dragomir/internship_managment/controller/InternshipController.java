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

    // GET internships (with optional query parameters for filtering)
    @GetMapping({"", "/all"})
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

    // POST internship (COMPANY only)
    @PostMapping({"", "/create"})
    @PreAuthorize("hasRole('COMPANY')")
    // napravi DTO da ne bi otkrivao unutrasnju strukturu domena
    public ResponseEntity<ApiResponse> createInternship(@RequestBody Internship offer, Authentication auth) {

        Internship saved = internshipService.createOfferByUser(offer, auth);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Internship created successfully", saved));
    }
}
