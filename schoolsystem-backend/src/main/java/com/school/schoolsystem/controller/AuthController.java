package com.school.schoolsystem.controller;

import com.school.schoolsystem.dto.ForgotPasswordRequest;
import com.school.schoolsystem.dto.LoginRequest;
import com.school.schoolsystem.dto.LoginResponse;
import com.school.schoolsystem.dto.StudentRegistrationRequest;
import com.school.schoolsystem.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/forgot-password")
    public LoginResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return authService.resetPassword(request);
    }

    @PostMapping("/register/student")
    public LoginResponse registerStudent(@Valid @RequestBody StudentRegistrationRequest request) {
        return authService.registerStudent(request);
    }
}
