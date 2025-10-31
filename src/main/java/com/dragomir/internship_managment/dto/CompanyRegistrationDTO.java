package com.dragomir.internship_managment.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CompanyRegistrationDTO {

    @NotBlank(message = "Email je obavezan")
    @Email(message = "Email mora biti validan")
    private String email;

    @NotBlank(message = "Lozinka je obavezna")
    @Size(min = 6, message = "Lozinka mora imati minimum 6 karaktera")
    private String password;

    @NotBlank(message = "Naziv kompanije je obavezan")
    private String companyName;

    @NotBlank(message = "PIB je obavezan")
    @Size(min = 8, max = 9, message = "PIB mora imati 8 ili 9 cifara")
    private String pib;

    @NotBlank(message = "Adresa je obavezna")
    private String address;

    @NotBlank(message = "Kontakt osoba je obavezna")
    private String contactPerson;

    @NotBlank(message = "Telefon je obavezan")
    private String phoneNumber;
    private String website;
    private String description;
    private String companySize;
}