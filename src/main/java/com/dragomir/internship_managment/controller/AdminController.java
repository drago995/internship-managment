package com.dragomir.internship_managment.controller;

import com.dragomir.internship_managment.domain.Application;
import com.dragomir.internship_managment.domain.Company;
import com.dragomir.internship_managment.domain.Student;
import com.dragomir.internship_managment.dto.ApiResponse;
import com.dragomir.internship_managment.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/students")
    public ResponseEntity<ApiResponse> getAllStudents() {
        List<Student> students = adminService.getAllStudents();
        return ResponseEntity.ok(new ApiResponse(true, "Lista svih studenata", students));
    }

    @GetMapping("/companies")
    public ResponseEntity<ApiResponse> getAllCompanies() {
        List<Company> companies = adminService.getAllCompanies();
        return ResponseEntity.ok(new ApiResponse(true, "Lista svih kompanija", companies));
    }

    @GetMapping("/applications")
    public ResponseEntity<ApiResponse> getAllApplications() {
        List<Application> applications = adminService.getAllApplications();
        return ResponseEntity.ok(new ApiResponse(true, "Lista svih prijava", applications));
    }
}
