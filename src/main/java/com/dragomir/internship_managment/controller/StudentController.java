package com.dragomir.internship_managment.controller;

import com.dragomir.internship_managment.domain.Student;
import com.dragomir.internship_managment.dto.ApiResponse;
import com.dragomir.internship_managment.service.StudentService;
import com.dragomir.internship_managment.service.UserService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
        return  ResponseEntity.ok
                (new ApiResponse(true, "Student fount", student));
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

    @DeleteMapping("/profile/cv")
    public ResponseEntity<ApiResponse> deleteCV(Authentication authentication) {
        studentService.deleteStudentCV(authentication.getName());

        ApiResponse response = new ApiResponse(true, "CV uspešno obrisan!");
        return ResponseEntity.ok(response);

    }

    @GetMapping("/profile/cv/download")
    public ResponseEntity<Resource> downloadCV(Authentication authentication) throws IOException {
        Resource resource = studentService.getStudentCV(authentication.getName());

        // Return the file as attachment
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + resource.getFilename() + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }


}
