package com.dragomir.internship_managment.controller;

import com.dragomir.internship_managment.domain.Application;
import com.dragomir.internship_managment.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student/applications")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class ApplicationController {

    private final ApplicationService service;

    @PostMapping("/{internshipId}")
    public ResponseEntity<Application> apply(@PathVariable Long internshipId, Authentication auth) {
        Application application = service.apply(internshipId, auth);
        return ResponseEntity.ok(application);
    }

    @GetMapping
    public ResponseEntity<List<Application>> myApplications(Authentication auth) {
        List<Application> applications = service.getApplicationsForStudent(auth);
        return ResponseEntity.ok(applications);
    }
}