package com.dragomir.internship_managment.service;

import com.dragomir.internship_managment.domain.User;
import com.dragomir.internship_managment.dto.AuthResponseDTO;
import com.dragomir.internship_managment.dto.LoginDTO;
import com.dragomir.internship_managment.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    public AuthResponseDTO authenticateUser(LoginDTO loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getEmail(),
                        loginDto.getPassword()
                )
        );
        // generate the jew token first tame after user login, and send it back to him
        // also fill the security context on every request
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateToken(authentication);

        User user = userService.findByEmail(loginDto.getEmail());

        return new AuthResponseDTO(
                jwt,
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}