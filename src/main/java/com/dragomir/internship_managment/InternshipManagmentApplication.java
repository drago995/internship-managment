package com.dragomir.internship_managment;

import com.dragomir.internship_managment.domain.*;
import com.dragomir.internship_managment.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@SpringBootApplication
@RequiredArgsConstructor
public class InternshipManagmentApplication {

	public static void main(String[] args) {
		SpringApplication.run(InternshipManagmentApplication.class, args);
	}


}