package com.dragomir.internship_managment.dto;


import com.dragomir.internship_managment.domain.Company;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PendingInternshipDTO {

    private Long id;
    private String title;
    private String companyName;
    private String category;
    private Integer durationWeeks;
    private Integer availablePositions;
}