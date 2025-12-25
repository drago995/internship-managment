package com.dragomir.internship_managment.service;

import com.dragomir.internship_managment.domain.Company;
import com.dragomir.internship_managment.domain.Internship;
import com.dragomir.internship_managment.dto.InternshipDTO;
import com.dragomir.internship_managment.repository.CompanyRepository;
import com.dragomir.internship_managment.repository.InternshipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final InternshipRepository internshipRepository;

    public List<InternshipDTO> getInternshipsByCompany(Long companyId) {

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        return internshipRepository.findByCompany(company)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    private InternshipDTO toDTO(Internship i) {
        return new InternshipDTO(
                i.getId(),
                i.getTitle(),
                i.getDescription(),
                i.getApplicationsCount()
        );
    }

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }
}
