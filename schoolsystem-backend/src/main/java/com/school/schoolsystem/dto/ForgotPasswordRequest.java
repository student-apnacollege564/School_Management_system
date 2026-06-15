package com.school.schoolsystem.dto;

import jakarta.validation.constraints.NotBlank;

public class ForgotPasswordRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String role;

    @NotBlank
    private String newPassword;

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }

    public String getNewPassword() {
        return newPassword;
    }
}
