package com.dragomir.internship_managment.service;

import com.dragomir.internship_managment.controller.StudentController;
import com.dragomir.internship_managment.domain.Student;
import com.dragomir.internship_managment.repository.StudentRepository;

public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student getStudentByEmail(String email) {
        return studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }
}
