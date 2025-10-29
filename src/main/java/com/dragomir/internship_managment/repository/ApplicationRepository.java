package com.dragomir.internship_managment.repository;

import com.dragomir.internship_managment.domain.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByInternship_Company_Id(Long companyId);
    List<Application> findByStudent_Id(Long studentId);
}