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

	@Bean
	CommandLineRunner initDatabase(
			CompanyRepository companyRepository,
			StudentRepository studentRepository,
			InternshipRepository internshipRepository,
			ApplicationRepository applicationRepository,
			PasswordEncoder passwordEncoder,
			UserRepository userRepository
	) {

		return args -> {

			Faculty admin = new Faculty();
			admin.setEmail("admin@faculty.com");
			admin.setPassword(passwordEncoder.encode("admin123"));
			admin.setRole(UserRole.FACULTY);
			admin.setFacultyName("FON");
			userRepository.save(admin);





			Company company1 = new Company();
			company1.setEmail("techsolutions@example.com");
			company1.setPassword(passwordEncoder.encode("password123"));
			company1.setRole(UserRole.COMPANY);
			company1.setCompanyName("Tech Solutions doo");
			company1.setPib("123456789");
			company1.setAddress("Knez Mihailova 15, Beograd 11000");
			company1.setContactPerson("Marko Marković");
			company1.setPhoneNumber("+381641234567");
			company1.setDescription("Vodeca IT kompanija u Srbiji specijalizovana za razvoj web i mobilnih aplikacija.");
			company1.setWebsite("https://techsolutions.rs");
			company1.setIndustry("IT");
			companyRepository.save(company1);

			Company company2 = new Company();
			company2.setEmail("digitalinnovations@example.com");
			company2.setPassword(passwordEncoder.encode("password123"));
			company2.setRole(UserRole.COMPANY);
			company2.setCompanyName("Digital Innovations");
			company2.setPib("987654321");
			company2.setAddress("Bulevar Oslobodjenja 23, Novi Sad 21000");
			company2.setContactPerson("Ana Anić");
			company2.setPhoneNumber("+381659876543");
			company2.setDescription("Inovativna kompanija fokusirana na cloud i AI resenja.");
			company2.setWebsite("https://digitalinnovations.com");
			company2.setIndustry("Software Development");
			companyRepository.save(company2);

			Student student1 = new Student();
			student1.setEmail("kukic.aleksandar@gmail.com");
			student1.setPassword(passwordEncoder.encode("password123"));
			student1.setRole(UserRole.STUDENT);
			student1.setFirstName("Petar");
			student1.setLastName("Petrović");
			student1.setIndexNumber("2020/0001");
			student1.setFaculty("Elektrotehnički fakultet, Beograd");
			student1.setPhoneNumber("+381641111111");
			student1.setStudyYear("3");
			student1.setBio("Student softverskog inzenjerstva sa strašću za web development.");
			student1.setGpa(9.2);
			student1.setSkills("Java, Spring Boot, React, JavaScript, SQL");
			studentRepository.save(student1);

			Student student2 = new Student();
			student2.setEmail("marija.jovanovic@student.ftn.uns.ac.rs");
			student2.setPassword(passwordEncoder.encode("password123"));
			student2.setRole(UserRole.STUDENT);
			student2.setFirstName("Marija");
			student2.setLastName("Jovanović");
			student2.setIndexNumber("2021/0042");
			student2.setFaculty("Fakultet tehničkih nauka, Novi Sad");
			student2.setPhoneNumber("+381652222222");
			student2.setStudyYear("2");
			student2.setBio("Zainteresovana za frontend development i UI/UX dizajn.");
			student2.setGpa(8.7);
			student2.setSkills("HTML, CSS, JavaScript, React, Figma");
			studentRepository.save(student2);

			Internship internship1 = new Internship();
			internship1.setCompany(company1);
			internship1.setTitle("Frontend Developer Internship");
			internship1.setDescription("Razvoj modernih web aplikacija koristeći React i TypeScript. Rad na realnim projektima uz mentorstvo iskusnih developera. Učenje best practices, Agile metodologije i rad u timu.");
			internship1.setStartDate(LocalDate.of(2025, 2, 1));
			internship1.setEndDate(LocalDate.of(2025, 5, 1));
			internship1.setAvailablePositions(3);
			internship1.setFilledPositions(0);
			internship1.setRequirements("Osnovno znanje JavaScript, HTML, CSS. Poznavanje React je plus. Motivisanost za učenje.");
			internship1.setResponsibilities("Razvoj UI komponenti, integracija sa REST API-jima, pisanje testova, code review.");
			internship1.setLocation("Beograd");
			internship1.setIsRemote(false);
			internship1.setIsPaid(true);
			internship1.setSalary(30000.0);
			internship1.setDurationWeeks(12);
			internship1.setSkills("React, JavaScript, TypeScript, HTML, CSS");
			internship1.setCategory("Web Development");
			internship1.setDeadline(LocalDate.of(2025, 1, 15));
			internship1.setCreatedAt(LocalDateTime.now());
			internship1.setUpdatedAt(LocalDateTime.now());
			internshipRepository.save(internship1);

			Internship internship2 = new Internship();
			internship2.setCompany(company1);
			internship2.setTitle("Backend Java Developer");
			internship2.setDescription("Učenje Spring Boot framework-a i razvoj REST API-ja. Rad sa bazama podataka i mikroservisnom arhitekturom. Mentorstvo i pair programming sa senior developerima.");
			internship2.setStartDate(LocalDate.of(2025, 3, 1));
			internship2.setEndDate(LocalDate.of(2025, 6, 1));
			internship2.setAvailablePositions(2);
			internship2.setFilledPositions(0);
			internship2.setRequirements("Java osnove, OOP principi, SQL. Poznavanje Spring-a je plus.");
			internship2.setResponsibilities("Razvoj REST API-ja, rad sa bazama podataka, pisanje unit testova, dokumentacija.");
			internship2.setLocation("Beograd");
			internship2.setIsRemote(false);
			internship2.setIsPaid(true);
			internship2.setSalary(35000.0);
			internship2.setDurationWeeks(12);
			internship2.setSkills("Java, Spring Boot, SQL, REST API");
			internship2.setCategory("Backend Development");
			internship2.setDeadline(LocalDate.of(2025, 2, 15));
			internship2.setCreatedAt(LocalDateTime.now());
			internship2.setUpdatedAt(LocalDateTime.now());
			internshipRepository.save(internship2);

			Internship internship3 = new Internship();
			internship3.setCompany(company2);
			internship3.setTitle("Full Stack Developer Internship");
			internship3.setDescription("Rad na kompletnom tech stack-u - od frontend-a do backend-a. Praktično iskustvo sa agilnim razvojem. Fleksibilno radno vreme i mogućnost remote rada.");
			internship3.setStartDate(LocalDate.of(2025, 2, 15));
			internship3.setEndDate(LocalDate.of(2025, 5, 15));
			internship3.setAvailablePositions(2);
			internship3.setFilledPositions(0);
			internship3.setRequirements("JavaScript/TypeScript, osnove Node.js i React. Poznavanje SQL baza podataka.");
			internship3.setResponsibilities("Razvoj full-stack aplikacija, API integracije, deployment, code review.");
			internship3.setLocation("Novi Sad (Remote moguće)");
			internship3.setIsRemote(true);
			internship3.setIsPaid(true);
			internship3.setSalary(40000.0);
			internship3.setDurationWeeks(12);
			internship3.setSkills("JavaScript, TypeScript, Node.js, React, SQL");
			internship3.setCategory("Full Stack Development");
			internship3.setDeadline(LocalDate.of(2025, 2, 1));
			internship3.setCreatedAt(LocalDateTime.now());
			internship3.setUpdatedAt(LocalDateTime.now());
			internshipRepository.save(internship3);

			Internship internship4 = new Internship();
			internship4.setCompany(company2);
			internship4.setTitle("DevOps Internship");
			internship4.setDescription("Upoznavanje sa CI/CD pipeline-ovima, Docker, Kubernetes i cloud tehnologijama. Rad u DevOps timu na automatizaciji deployment procesa.");
			internship4.setStartDate(LocalDate.of(2025, 3, 1));
			internship4.setEndDate(LocalDate.of(2025, 8, 1));
			internship4.setAvailablePositions(1);
			internship4.setFilledPositions(0);
			internship4.setRequirements("Linux osnove, interes za automatizaciju, osnove bash scripting-a.");
			internship4.setResponsibilities("Održavanje CI/CD pipeline-a, Docker kontejnerizacija, monitoring sistema.");
			internship4.setLocation("Novi Sad");
			internship4.setIsRemote(false);
			internship4.setIsPaid(false);
			internship4.setSalary(null);
			internship4.setDurationWeeks(20);
			internship4.setSkills("Linux, Docker, CI/CD, Bash");
			internship4.setCategory("DevOps");
			internship4.setDeadline(LocalDate.of(2025, 2, 20));
			internship4.setCreatedAt(LocalDateTime.now());
			internship4.setUpdatedAt(LocalDateTime.now());
			internshipRepository.save(internship4);

			Application application1 = new Application();
			application1.setStudent(student1);
			application1.setInternship(internship2);
			application1.setStatus(ApplicationStatus.PENDING);
			application1.setAppliedAt(LocalDateTime.now().minusDays(2));
			application1.setCoverLetter("Zainteresovan sam za ovu poziciju jer zelim da produbim svoje znanje Spring Boot-a.");
			application1.setCvUrl("https://example.com/cv/petar-petrovic.pdf");
			applicationRepository.save(application1);

			Application application2 = new Application();
			application2.setStudent(student2);
			application2.setInternship(internship1);
			application2.setStatus(ApplicationStatus.PENDING);
			application2.setAppliedAt(LocalDateTime.now().minusDays(1));
			application2.setCoverLetter("Veoma sam motivisana da radim na React projektima i učim od iskusnih mentora.");
			application2.setCvUrl("https://example.com/cv/marija-jovanovic.pdf");
			applicationRepository.save(application2);

			System.out.println(" Test data initialized successfully!");
			System.out.println(" Summary:");

			System.out.println("   Company 1: techsolutions@example.com / password123");
			System.out.println("   Company 2: digitalinnovations@example.com / password123");
			System.out.println("   Student 1: petar.petrovic@student.etf.bg.ac.rs / password123");
			System.out.println("   Student 2: marija.jovanovic@student.ftn.uns.ac.rs / password123");
		};
	}
}