package com.dragomir.internship_managment.service;

import com.dragomir.internship_managment.controller.StudentController;
import com.dragomir.internship_managment.domain.Student;
import com.dragomir.internship_managment.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class StudentService {
    @Value("${app.cv.upload-dir}") // e.g., set in application.properties
    private String uploadDir;
    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student getStudentByEmail(String email) {
        return studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public void updateStudent(Student student) {
    }

    public Map<String, Object> saveCV(String email, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("Fajl je prazan");
        }

        if (!"application/pdf".equals(file.getContentType())) {
            throw new RuntimeException("Samo PDF fajlovi su dozvoljeni");
        }

        // Get student by email
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // make folder if it doesnt exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Save file with unique name
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // updating the cv url of the student in the db
        student.setCvFilePath("/cv/" + filename);
        studentRepository.save(student);


        Map<String, Object> cvInfo = new HashMap<>();
        cvInfo.put("filename", filename);
        cvInfo.put("url", student.getCvFilePath());
        cvInfo.put("uploadDate", LocalDateTime.now());

        return cvInfo;
    }
}
