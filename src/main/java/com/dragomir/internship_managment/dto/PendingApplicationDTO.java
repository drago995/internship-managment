package com.dragomir.internship_managment.dto;



import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PendingApplicationDTO {
    private Long id;
    private String studentName;
    private String studentEmail;
    private String internshipTitle;
    private Integer internshipDurationWeeks;
}