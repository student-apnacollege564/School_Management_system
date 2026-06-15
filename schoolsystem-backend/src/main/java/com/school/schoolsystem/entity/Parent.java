package com.school.schoolsystem.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Parent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    private String contact;

    private String address;

    private boolean active = true;

    /**
     * Simple link to student without enforcing a JPA relation yet.
     * This keeps the demo DB setup straightforward.
     */
    private Long studentId;

    public Parent() {
    }

    public Parent(String name, String contact, String address, boolean active, Long studentId) {
        this.name = name;
        this.contact = contact;
        this.address = address;
        this.active = active;
        this.studentId = studentId;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
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

    public Long getStudentId() {
        return studentId;
    }

    public void setName(String name) {
        this.name = name;
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

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
}

