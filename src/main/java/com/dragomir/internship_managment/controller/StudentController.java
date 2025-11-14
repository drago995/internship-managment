package com.dragomir.internship_managment.controller;

import com.dragomir.internship_managment.domain.Student;
import com.dragomir.internship_managment.dto.ApiResponse;
import com.dragomir.internship_managment.service.StudentService;
import com.dragomir.internship_managment.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
