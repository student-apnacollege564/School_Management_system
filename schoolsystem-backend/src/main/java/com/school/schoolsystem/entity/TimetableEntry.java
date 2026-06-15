package com.school.schoolsystem.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;

@Entity
public class TimetableEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String dayOfWeek;

    @NotBlank
    private String className;

    private String section;

    @NotBlank
    private String slot;

    @NotBlank
    private String subject;

    @NotBlank
    private String teacherName;

    public TimetableEntry() {
    }

    public TimetableEntry(String dayOfWeek, String className, String section, String slot, String subject, String teacherName) {
        this.dayOfWeek = dayOfWeek;
        this.className = className;
        this.section = section;
        this.slot = slot;
        this.subject = subject;
        this.teacherName = teacherName;
    }

    public Long getId() {
        return id;
    }

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public String getClassName() {
        return className;
    }

    public String getSection() {
        return section;
    }

    public String getSlot() {
        return slot;
    }

    public String getSubject() {
        return subject;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public void setSlot(String slot) {
        this.slot = slot;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }
}

