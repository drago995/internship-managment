package com.dragomir.internship_managment.controller;
import com.dragomir.internship_managment.domain.Application;
import com.dragomir.internship_managment.domain.Internship;
import com.dragomir.internship_managment.dto.ApiResponse;
import com.dragomir.internship_managment.service.ApplicationService;
import com.dragomir.internship_managment.service.InternshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/internships")
public class InternshipController {

    private final InternshipService internshipService;
    private final ApplicationService applicationService;

    @Autowired
    public InternshipController(InternshipService internshipService, ApplicationService applicationService) {
        this.internshipService = internshipService;
        this.applicationService = applicationService;
    }


    @GetMapping
    public ResponseEntity<ApiResponse> getFilteredInternships(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "limit", defaultValue = "5") int limit,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "company", required = false) String company,
            @RequestParam(value = "weeksDuration", required = false) Integer weeksDuration,
            @RequestParam(value = "isPaid", required = false) Boolean isPaid,
            Authentication auth
    ) {
        boolean isStudent = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_STUDENT"));
        var result = internshipService.getFilteredInternships(page, limit, search, location, company, weeksDuration, isPaid, isStudent);
        return ResponseEntity.ok(new ApiResponse(true, "Internships retrieved successfully", result));
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getInternshipById(@PathVariable Long id) {
        var internship = internshipService.getInternshipById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Internship retrieved successfully", internship));
    }


    @PostMapping
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<ApiResponse> createInternship(@RequestBody Internship offer, Authentication auth) {
        Internship saved = internshipService.createOfferByUser(offer, auth);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Internship created successfully", saved));
    }


    @GetMapping("/my")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<ApiResponse> getMyInternships(Authentication auth) {
        var result = internshipService.getInternshipsByCompany(auth);
        return ResponseEntity.ok(new ApiResponse(true, "My internships retrieved successfully", result));
    }


    @PostMapping("/{internshipId}/applications")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse> apply(@PathVariable Long internshipId, Authentication auth) {
        Application application = applicationService.apply(internshipId, auth);
        return ResponseEntity.ok(new ApiResponse(true, "Successfully applied!", application));
    }


    @GetMapping("/{internshipId}/applications")
    @PreAuthorize("hasAnyRole('COMPANY', 'FACULTY')")
    public ResponseEntity<ApiResponse> getApplicationsByInternship(@PathVariable Long internshipId) {
        var applications = applicationService.getApplicationsByInternship(internshipId);
        return ResponseEntity.ok(new ApiResponse(true, "Applications retrieved successfully", applications));
    }

    @PutMapping("/{id}/{action}")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<ApiResponse> decideInternship(
            @PathVariable Long id,
            @PathVariable String action,
            Authentication auth) {

        Internship internship;

        if ("approve".equalsIgnoreCase(action)) {
            internship = internshipService.approve(id, auth);
            return ResponseEntity.ok(new ApiResponse(true, "Internship approved", internship));
        } else if ("reject".equalsIgnoreCase(action)) {
            internship = internshipService.reject(id, auth);
            return ResponseEntity.ok(new ApiResponse(true, "Internship rejected", internship));
        } else {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Invalid action: must be 'approve' or 'reject'", null));
        }
    }


    @GetMapping("/pending")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<ApiResponse> getPendingInternships() {
        var result = internshipService.getPendingForFaculty();
        return ResponseEntity.ok(
                new ApiResponse(true, "Pending internships retrieved", result)
        );
    }


}
