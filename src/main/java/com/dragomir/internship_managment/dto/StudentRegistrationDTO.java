package com.dragomir.internship_managment.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class StudentRegistrationDTO{

    @NotBlank(message = "Email je obavezan")
    @Email(message = "Email mora biti validan")
    private String email;

    @NotBlank(message = "Lozinka je obavezna")
    @Size(min = 6, message = "Lozinka mora imati minimum 6 karaktera")
    private String password;

    @NotBlank(message = "Ime je obavezno")
    private String firstName;

    @NotBlank(message = "Prezime je obavezno")
    private String lastName;

    @NotBlank(message = "Broj indeksa je obavezan")
    private String indexNumber;

    @NotBlank(message = "Fakultet je obavezan")
    private String faculty;

    private String phoneNumber;
    private String studyYear;
    private String bio;
}