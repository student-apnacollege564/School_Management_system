package com.school.schoolsystem.repository;

import com.school.schoolsystem.entity.TimetableEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimetableEntryRepository extends JpaRepository<TimetableEntry, Long> {
}

