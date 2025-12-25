package com.dragomir.internship_managment.repository;

import com.dragomir.internship_managment.domain.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudent_Id(Long studentId);
    List<Application> findByInternshipId(Long internshipId);
}
