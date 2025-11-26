package com.dragomir.internship_managment.service;

import com.dragomir.internship_managment.domain.Company;
import com.dragomir.internship_managment.domain.Internship;
import com.dragomir.internship_managment.repository.CompanyRepository;
import com.dragomir.internship_managment.repository.InternshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;

import java.util.List;

@Service
public class InternshipService {

    private final InternshipRepository internshipRepository;
    private final CompanyRepository companyRepository;

    @Autowired
    public InternshipService(InternshipRepository internshipRepository, CompanyRepository companyRepository) {
        this.internshipRepository = internshipRepository;
        this.companyRepository = companyRepository;

    }

    public Internship createOfferByUser(Internship offer, Authentication auth) {
        String email = auth.getName(); // get email from JWT
        Company company = companyRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        offer.setCompany(company);
        return internshipRepository.save(offer);
    }

    public List<Internship> getAllInternships() {
        return internshipRepository.findAll();
    }

    public Page<Internship> getFilteredInternships(int page, int limit, String search, String location, String company, Integer weeksDuration, Boolean isPaid){
        System.out.println("3AAAAAAAAAAAAAAAAAAAAAAAA");
        Pageable p = PageRequest.of(page -1, limit);
        return internshipRepository.findFilteredInternships(search, location, company, weeksDuration, isPaid, p);

    }

    public Internship getInternshipById(Long id) {
        return internshipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Internship with id " + id + " not found"));
    }



}