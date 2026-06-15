package com.school.schoolsystem.controller;

import com.school.schoolsystem.entity.Student;
import com.school.schoolsystem.entity.Teacher;
import com.school.schoolsystem.entity.Parent;
import com.school.schoolsystem.entity.TimetableEntry;
import com.school.schoolsystem.service.SchoolService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api")
public class SchoolController {
    private final SchoolService schoolService;

    public SchoolController(SchoolService schoolService) {
        this.schoolService = schoolService;
    }

    @GetMapping("/students")
    public List<Student> getStudents() {
        return schoolService.getAllStudents();
    }

    @PostMapping("/students")
    public Student addStudent(@Valid @RequestBody Student student) {
        return schoolService.createStudent(student);
    }

    @PutMapping("/students/{id}")
    public Student updateStudent(@PathVariable Long id, @Valid @RequestBody Student student) {
        try {
            return schoolService.updateStudent(id, student);
        } catch (NoSuchElementException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found");
        }
    }

    @DeleteMapping("/students/{id}")
    public void deleteStudent(@PathVariable Long id) {
        schoolService.deleteStudent(id);
    }

    @GetMapping("/teachers")
    public List<Teacher> getTeachers() {
        return schoolService.getAllTeachers();
    }

    @PostMapping("/teachers")
    public Teacher addTeacher(@Valid @RequestBody Teacher teacher) {
        return schoolService.createTeacher(teacher);
    }

    @PutMapping("/teachers/{id}")
    public Teacher updateTeacher(@PathVariable Long id, @Valid @RequestBody Teacher teacher) {
        try {
            return schoolService.updateTeacher(id, teacher);
        } catch (NoSuchElementException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher not found");
        }
    }

    @DeleteMapping("/teachers/{id}")
    public void deleteTeacher(@PathVariable Long id) {
        schoolService.deleteTeacher(id);
    }

    @GetMapping("/parents")
    public List<Parent> getParents() {
        return schoolService.getAllParents();
    }

    @PostMapping("/parents")
    public Parent addParent(@Valid @RequestBody Parent parent) {
        return schoolService.createParent(parent);
    }

    @PutMapping("/parents/{id}")
    public Parent updateParent(@PathVariable Long id, @Valid @RequestBody Parent parent) {
        try {
            return schoolService.updateParent(id, parent);
        } catch (NoSuchElementException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Parent not found");
        }
    }

    @DeleteMapping("/parents/{id}")
    public void deleteParent(@PathVariable Long id) {
        schoolService.deleteParent(id);
    }

    @GetMapping("/timetable")
    public List<TimetableEntry> getTimetableEntries() {
        return schoolService.getAllTimetableEntries();
    }

    @PostMapping("/timetable")
    public TimetableEntry addTimetableEntry(@Valid @RequestBody TimetableEntry entry) {
        try {
            return schoolService.createTimetableEntry(entry);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PutMapping("/timetable/{id}")
    public TimetableEntry updateTimetableEntry(@PathVariable Long id, @Valid @RequestBody TimetableEntry entry) {
        try {
            return schoolService.updateTimetableEntry(id, entry);
        } catch (NoSuchElementException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Timetable entry not found");
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @DeleteMapping("/timetable/{id}")
    public void deleteTimetableEntry(@PathVariable Long id) {
        schoolService.deleteTimetableEntry(id);
    }

    @GetMapping("/dashboard")
    public Map<String, Long> dashboardStats() {
        return schoolService.getDashboardStats();
    }
}
