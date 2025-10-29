package com.dragomir.internship_managment.controller;

import com.dragomir.internship_managment.domain.Company;
import com.dragomir.internship_managment.domain.Internship;
import com.dragomir.internship_managment.service.InternshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/company/internships")
@PreAuthorize("hasRole('COMPANY')")
public class InternshipController {

    private final InternshipService internshipService;

    @Autowired
    public InternshipController(InternshipService internshipService) {
        this.internshipService = internshipService;
    }

    @PostMapping
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<Internship> createOffer(@RequestBody Internship offer, Authentication auth) {
        Internship saved = internshipService.createOfferByUser(offer, auth);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<Internship> getAll() {
        return internshipService.getAllInternships();
    }
}
