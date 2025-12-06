package com.dragomir.internship_managment.service;

import com.dragomir.internship_managment.controller.StudentController;
import com.dragomir.internship_managment.domain.Student;
import com.dragomir.internship_managment.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
    @Value("${app.cv.upload-dir}")
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
    // pravimo transakciju - ne cuvamo fajl na disk ako ne uspe cuvanje u bazi
    @Transactional
    public Map<String, Object> saveCV(String email, MultipartFile file) throws IOException {


        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // for reupload, delete the already existing pdf
        if(student.getCvFilePath() != null){
            deleteStudentCV(email);
        }

        // generate unique filename
        String filename = file.getOriginalFilename();
        String cvPath = "/" + filename;


        student.setCvFilePath(cvPath);
        student.setCvFileName(file.getOriginalFilename());
        student.setCvUploadDate(LocalDateTime.now());
        studentRepository.save(student);

        // save file only after db commit
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        Map<String, Object> cvInfo = new HashMap<>();
        cvInfo.put("filename", file.getOriginalFilename());
        cvInfo.put("url", student.getCvFilePath());
        cvInfo.put("uploadDate", student.getCvUploadDate());

        return cvInfo;
    }

    public void deleteStudentCV(String name) {
        Student student = studentRepository.findByEmail(name)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        if(student.getCvFilePath() != null){
            Path filePath = Paths.get(uploadDir).resolve(Paths.get(student.getCvFilePath()).getFileName());
            try {
                Files.deleteIfExists(filePath);
            }   catch(IOException e) {
                System.out.println(" Failed to delete file" + e.getMessage());


            }

            student.setCvFilePath(null);
            student.setCvFileName(null);
            student.setCvUploadDate(null);

            // update DB again
            studentRepository.save(student);
        }
    }

    public Resource getStudentCV(String email) throws IOException {
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (student.getCvFilePath() == null) {
            throw new RuntimeException("CV not found");
        }

        Path filePath = Paths.get(uploadDir).resolve(Paths.get(student.getCvFilePath()).getFileName());
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            throw new RuntimeException("Could not read file");
        }

        return resource;
    }
}
