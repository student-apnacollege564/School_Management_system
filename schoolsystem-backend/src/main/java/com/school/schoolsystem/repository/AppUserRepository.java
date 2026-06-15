package com.school.schoolsystem.repository;

import com.school.schoolsystem.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByUsernameAndRole(String username, String role);

    boolean existsByUsername(String username);
}
