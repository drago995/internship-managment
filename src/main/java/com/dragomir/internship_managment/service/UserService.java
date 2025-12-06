
package com.dragomir.internship_managment.service;
import com.dragomir.internship_managment.domain.Company;
import com.dragomir.internship_managment.domain.Student;
import com.dragomir.internship_managment.domain.User;
import com.dragomir.internship_managment.domain.UserRole;
import com.dragomir.internship_managment.dto.StudentRegistrationDTO;
import com.dragomir.internship_managment.dto.CompanyRegistrationDTO;
import com.dragomir.internship_managment.exceptions.UserAlreadyExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.dragomir.internship_managment.repository.*;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Student registerStudent(StudentRegistrationDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
           throw new UserAlreadyExistsException("Email već postoji u sistemu");
        }

        if (studentRepository.existsByIndexNumber(dto.getIndexNumber())) {
           throw new UserAlreadyExistsException("Broj indeksa već postoji u sistemu");
        }

        Student student = new Student();
        student.setEmail(dto.getEmail());
        student.setPassword(passwordEncoder.encode(dto.getPassword()));
        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setIndexNumber(dto.getIndexNumber());
        student.setPhoneNumber(dto.getPhoneNumber());
        student.setStudyYear(dto.getStudyYear());
        student.setBio(dto.getBio());
        student.setRole(UserRole.STUDENT);

        return studentRepository.save(student);
    }

    @Transactional
    public Company registerCompany(CompanyRegistrationDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
           throw new UserAlreadyExistsException("Email već postoji u sistemu");
        }

        if (companyRepository.existsByPib(dto.getPib())) {
            throw new UserAlreadyExistsException("PIB već postoji u sistemu");
        }

        Company company = new Company();
        company.setEmail(dto.getEmail());
        company.setPassword(passwordEncoder.encode(dto.getPassword()));
        company.setCompanyName(dto.getCompanyName());
        company.setPib(dto.getPib());
        company.setAddress(dto.getAddress());
        company.setContactPerson(dto.getContactPerson());
        company.setPhoneNumber(dto.getPhoneNumber());
        company.setDescription(dto.getDescription());
        company.setWebsite(dto.getWebsite());
        company.setRole(UserRole.COMPANY);

        return companyRepository.save(company);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Korisnik nije pronađen"));
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Korisnik sa emailom " + email + " nije pronađen"));

        return  org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }
}
