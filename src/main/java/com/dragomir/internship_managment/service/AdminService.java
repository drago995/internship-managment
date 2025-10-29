package com.dragomir.internship_managment.service;



import com.dragomir.internship_managment.domain.Application;
import com.dragomir.internship_managment.domain.Company;
import com.dragomir.internship_managment.domain.Student;
import com.dragomir.internship_managment.repository.ApplicationRepository;
import com.dragomir.internship_managment.repository.CompanyRepository;
import com.dragomir.internship_managment.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final ApplicationRepository applicationRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }
}
