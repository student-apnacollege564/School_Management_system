package com.school.schoolsystem.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    private String grade;

    private String section;

    private String contact;

    private String address;

    private boolean active = true;

    @PositiveOrZero
    private int age;

    public Student() {
    }

    public Student(String name, String grade, int age) {
        this.name = name;
        this.grade = grade;
        this.age = age;
    }

    public Student(String name, String grade, String section, String contact, String address, boolean active, int age) {
        this.name = name;
        this.grade = grade;
        this.section = section;
        this.contact = contact;
        this.address = address;
        this.active = active;
        this.age = age;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getGrade() {
        return grade;
    }

    public String getSection() {
        return section;
    }

    public String getContact() {
        return contact;
    }

    public String getAddress() {
        return address;
    }

    public boolean isActive() {
        return active;
    }

    public int getAge() {
        return age;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
