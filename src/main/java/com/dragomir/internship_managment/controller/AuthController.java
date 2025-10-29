package com.dragomir.internship_managment.controller;

import com.dragomir.internship_managment.dto.*;
import com.dragomir.internship_managment.service.AuthService;
import com.dragomir.internship_managment.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final AuthService authService;

    @PostMapping("/register/student")
    public ResponseEntity<ApiResponse> registerStudent(@Valid @RequestBody StudentRegistrationDTO dto) {
        userService.registerStudent(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Registracija uspešna! Možete da se prijavite.", null));
    }

    @PostMapping("/register/company")
    public ResponseEntity<ApiResponse> registerCompany(@Valid @RequestBody CompanyRegistrationDTO dto) {
        userService.registerCompany(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Registracija uspešna! Možete da se prijavite.", null));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginDTO loginDto) {
        AuthResponseDTO response = authService.authenticateUser(loginDto);
        return ResponseEntity.ok(new ApiResponse(true, "Uspešno prijavljivanje.", response));
    }
}
