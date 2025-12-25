package com.dragomir.internship_managment.service;

import com.dragomir.internship_managment.domain.Application;
import com.dragomir.internship_managment.domain.Internship;
import com.dragomir.internship_managment.domain.Student;
import com.dragomir.internship_managment.dto.ApplicationDTO;
import com.dragomir.internship_managment.repository.ApplicationRepository;
import com.dragomir.internship_managment.repository.InternshipRepository;
import com.dragomir.internship_managment.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository repo;
    private final InternshipRepository internshipRepository;
    private final StudentRepository studentRepository;
    private final EmailService emailService;

    @Transactional
    public Application apply(Long internshipId, Authentication auth) {
        String email = auth.getName();
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new RuntimeException("Internship not found"));

        // Check if already applied
        List<Application> existingApplications = repo.findByStudent_Id(student.getId());
        boolean alreadyApplied = existingApplications.stream()
                .anyMatch(app -> app.getInternship().getId().equals(internshipId));

        if (alreadyApplied) {
            throw new RuntimeException("Already applied to this internship");
        }

        Application application = new Application();
        application.setStudent(student);
        application.setInternship(internship);
        application.setAppliedAt(LocalDateTime.now());

        Application savedApp = repo.save(application);

        //  send successfull applicaiton email
        emailService.sendEmail(
                student.getEmail(),
                "Uspešna prijava na praksu",
                "Zdravo " + student.getFirstName() +
                        ",\n\nUspešno ste se prijavili na praksu: " + internship.getTitle() +
                        ".\nUskoro ćete biti kontaktirani od strane kompanije " +
                        internship.getCompany().getCompanyName() + ".\n\nPozdrav,\nFakultet"
        );

        return savedApp;
    }

    public List<ApplicationDTO> getApplicationsByStudent(Authentication auth) {

        String email = auth.getName();
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));


        List<Application> applications = repo.findByStudent_Id(student.getId());


        return applications.stream().map(app -> new ApplicationDTO(
                app.getId(),
                student.getId(),
                app.getStatus(),
                app.getAppliedAt().toString(),
                app.getCoverLetter(),
                student.getCvFilePath(),
                student.getFirstName() + " " + student.getLastName(),

                app.getInternship().getId(),
                app.getInternship().getTitle(),
                app.getInternship().getCompany().getCompanyName(),
                app.getInternship().getDescription(),
                app.getInternship().getLocation(),
                app.getInternship().getDurationWeeks(),
                app.getInternship().getSalary(),
                app.getInternship().getIsPaid()
        )).toList();
    }


    public List<Application> getAllApplications() {
        return repo.findAll();
    }

    public List<ApplicationDTO> getApplicationsByInternship(Long internshipId) {
        List<Application> applications = repo.findByInternshipId(internshipId);
        return applications.stream().map(app -> new ApplicationDTO(
                app.getId(),
                app.getStudent().getId(),
                app.getStatus(),
                app.getAppliedAt().toString(),
                app.getCoverLetter(),
                app.getStudent().getCvFilePath(),
                app.getStudent().getFirstName() + " " + app.getStudent().getLastName(),

                app.getInternship().getId(),
                app.getInternship().getTitle(),
                app.getInternship().getCompany().getCompanyName(),
                app.getInternship().getDescription(),
                app.getInternship().getLocation(),
                app.getInternship().getDurationWeeks(),
                app.getInternship().getSalary(),
                app.getInternship().getIsPaid()
        )).toList();

    }

    public Application reject(Long id, String reason) {
        return null;
    }

    public Application approve(Long id) {
        return null;
    }
}

