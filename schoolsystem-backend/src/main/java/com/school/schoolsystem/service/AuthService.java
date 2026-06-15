package com.school.schoolsystem.service;

import com.school.schoolsystem.dto.ForgotPasswordRequest;
import com.school.schoolsystem.dto.LoginRequest;
import com.school.schoolsystem.dto.LoginResponse;
import com.school.schoolsystem.dto.StudentRegistrationRequest;
import com.school.schoolsystem.entity.AppUser;
import com.school.schoolsystem.entity.Student;
import com.school.schoolsystem.repository.AppUserRepository;
import com.school.schoolsystem.repository.StudentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final AppUserRepository appUserRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AppUserRepository appUserRepository,
            StudentRepository studentRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.appUserRepository = appUserRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(LoginRequest request) {
        return appUserRepository.findByUsernameAndRole(request.getUsername(), request.getRole().toLowerCase())
                .filter(user -> passwordEncoder.matches(request.getPassword(), user.getPasswordHash()))
                .map(user -> new LoginResponse(true, "Login successful", user.getRole(), user.getFullName()))
                .orElseGet(() -> new LoginResponse(false, "Invalid username, password, or role", null, null));
    }

    public LoginResponse resetPassword(ForgotPasswordRequest request) {
        AppUser user = appUserRepository.findByUsernameAndRole(request.getUsername(), request.getRole().toLowerCase())
                .orElse(null);
        if (user == null) {
            return new LoginResponse(false, "User not found for this role", null, null);
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        appUserRepository.save(user);
        return new LoginResponse(true, "Password updated successfully", user.getRole(), user.getFullName());
    }

    @Transactional
    public LoginResponse registerStudent(StudentRegistrationRequest request) {
        if (appUserRepository.existsByUsername(request.getUsername().trim())) {
            return new LoginResponse(false, "Username already taken", null, null);
        }

        Student student = new Student(
                request.getName().trim(),
                request.getGrade().trim(),
                request.getSection() == null ? "" : request.getSection().trim(),
                request.getContact() == null ? "" : request.getContact().trim(),
                request.getAddress() == null ? "" : request.getAddress().trim(),
                true,
                request.getAge()
        );
        studentRepository.save(student);

        AppUser user = new AppUser(
                request.getUsername().trim(),
                passwordEncoder.encode(request.getPassword()),
                "student",
                request.getName().trim()
        );
        appUserRepository.save(user);

        return new LoginResponse(true, "Registration successful. You can now login.", "student", user.getFullName());
    }
}
