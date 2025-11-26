package com.dragomir.internship_managment.controller;

import com.dragomir.internship_managment.domain.Student;
import com.dragomir.internship_managment.dto.ApiResponse;
import com.dragomir.internship_managment.service.StudentService;
import com.dragomir.internship_managment.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService userService) {
        this.studentService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse> getStudentProfile(Authentication authentication){
        String email = authentication.getName();
        Student student = studentService.getStudentByEmail(email);
        return  ResponseEntity.status(HttpStatus.FOUND)
                .body(new ApiResponse(true, "Student fount", student));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse> updateStudentProfile(@RequestBody Student updatedStudent,
                                                            Authentication authentication) {
        studentService.updateStudent(updatedStudent);
        return ResponseEntity.ok(new ApiResponse(true, "Profile updated", updatedStudent));
    }

    @PostMapping("/profile/cv")
    public ResponseEntity<ApiResponse> uploadCV(@RequestParam("cv") MultipartFile file,
                                                Authentication authentication) throws IOException {
        Map<String, Object> cvInfo =  studentService.saveCV(authentication.getName(), file);
        return ResponseEntity.ok(new ApiResponse(true, "CV uploaded ", cvInfo));
    }

}
