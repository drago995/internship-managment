package com.dragomir.internship_managment.domain;



import jakarta.persistence.*;
import lombok.*;

@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Entity
@Table(name = "faculties")
public class Faculty extends User {

    @Column(name = "faculty_name", nullable = false, length = 255)
    private String facultyName;


}