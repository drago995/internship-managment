package com.dragomir.internship_managment.domain;

import com.dragomir.internship_managment.dto.StudentRegistrationDTO;
import com.dragomir.internship_managment.exception.UserAlreadyExistsException;
import com.dragomir.internship_managment.repository.StudentRepository;
import com.dragomir.internship_managment.repository.UserRepository;
import com.dragomir.internship_managment.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.mockito.ArgumentMatchers.any;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void shouldRegisterStudentSuccessfully() {
        StudentRegistrationDTO dto = new StudentRegistrationDTO();
        dto.setFirstName("Drago");
        dto.setLastName("Vlacic");
        dto.setBio("blablablabla");
        dto.setStudyYear("5");
        dto.setPhoneNumber("063123123");
        dto.setIndexNumber("2018/414");
        dto.setPassword("password123");
        dto.setEmail("drago@gmail.com");

        // 'podesavam' stanje koje mi treba u ovom scenariju
        when(userRepository.existsByEmail("drago@gmail.com")).thenReturn(false);
        when(studentRepository.existsByIndexNumber("2018/414")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword123");

        Student savedStudent = new Student();
        savedStudent.setEmail("drago@gmail.com");

        when(studentRepository.save(any(Student.class))).thenReturn(savedStudent);

        Student result = userService.registerStudent(dto);

        assertNotNull(result);
        assertEquals("drago@gmail.com", result.getEmail());

        verify(studentRepository).save(any(Student.class));
    }

    @Test
    void shouldThrowUserAlreadyExistsExceptionWhenEmailAlreadyInUse()
    {
        StudentRegistrationDTO dto = new StudentRegistrationDTO();
        dto.setFirstName("Drago");
        dto.setLastName("Vlacic");
        dto.setBio("blablablabla");
        dto.setStudyYear("5");
        dto.setPhoneNumber("063123123");
        dto.setIndexNumber("2018/414");
        dto.setPassword("password123");
        dto.setEmail("drago@gmail.com");
        when(userRepository.existsByEmail("drago@gmail.com")).thenReturn(true);
        assertThrows(UserAlreadyExistsException.class, () ->{
            userService.registerStudent(dto);
        });


    }
}

