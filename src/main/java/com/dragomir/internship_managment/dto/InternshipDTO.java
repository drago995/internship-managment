package com.dragomir.internship_managment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InternshipDTO {
    private Long id;
    private String title;
    private String description;
    private int applicantsCount;
}
