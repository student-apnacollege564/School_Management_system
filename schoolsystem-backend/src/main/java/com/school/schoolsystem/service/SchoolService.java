package com.school.schoolsystem.service;

import com.school.schoolsystem.entity.Student;
import com.school.schoolsystem.entity.Teacher;
import com.school.schoolsystem.entity.Parent;
import com.school.schoolsystem.entity.TimetableEntry;
import com.school.schoolsystem.repository.StudentRepository;
import com.school.schoolsystem.repository.TeacherRepository;
import com.school.schoolsystem.repository.ParentRepository;
import com.school.schoolsystem.repository.TimetableEntryRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Map;

@Service
public class SchoolService {
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final ParentRepository parentRepository;
    private final TimetableEntryRepository timetableEntryRepository;

    public SchoolService(
            StudentRepository studentRepository,
            TeacherRepository teacherRepository,
            ParentRepository parentRepository,
            TimetableEntryRepository timetableEntryRepository
    ) {
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.parentRepository = parentRepository;
        this.timetableEntryRepository = timetableEntryRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    public Student updateStudent(Long id, Student student) {
        Student existing = studentRepository.findById(id).orElseThrow(NoSuchElementException::new);
        existing.setName(student.getName());
        existing.setGrade(student.getGrade());
        existing.setSection(student.getSection());
        existing.setContact(student.getContact());
        existing.setAddress(student.getAddress());
        existing.setActive(student.isActive());
        existing.setAge(student.getAge());
        return studentRepository.save(existing);
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    public Teacher createTeacher(Teacher teacher) {
        return teacherRepository.save(teacher);
    }

    public Teacher updateTeacher(Long id, Teacher teacher) {
        Teacher existing = teacherRepository.findById(id).orElseThrow(NoSuchElementException::new);
        existing.setName(teacher.getName());
        existing.setSubject(teacher.getSubject());
        existing.setContact(teacher.getContact());
        existing.setAddress(teacher.getAddress());
        existing.setAssignedClass(teacher.getAssignedClass());
        existing.setActive(teacher.isActive());
        return teacherRepository.save(existing);
    }

    public void deleteTeacher(Long id) {
        teacherRepository.deleteById(id);
    }

    public List<Parent> getAllParents() {
        return parentRepository.findAll();
    }

    public Parent createParent(Parent parent) {
        return parentRepository.save(parent);
    }

    public Parent updateParent(Long id, Parent parent) {
        Parent existing = parentRepository.findById(id).orElseThrow(NoSuchElementException::new);
        existing.setName(parent.getName());
        existing.setContact(parent.getContact());
        existing.setAddress(parent.getAddress());
        existing.setActive(parent.isActive());
        existing.setStudentId(parent.getStudentId());
        return parentRepository.save(existing);
    }

    public void deleteParent(Long id) {
        parentRepository.deleteById(id);
    }

    public List<TimetableEntry> getAllTimetableEntries() {
        return timetableEntryRepository.findAll().stream()
                .sorted(Comparator.comparing(TimetableEntry::getDayOfWeek)
                        .thenComparing(TimetableEntry::getClassName)
                        .thenComparing(entry -> entry.getSection() == null ? "" : entry.getSection())
                        .thenComparing(TimetableEntry::getSlot))
                .toList();
    }

    public TimetableEntry createTimetableEntry(TimetableEntry entry) {
        ensureNoTimetableConflict(entry, null);
        return timetableEntryRepository.save(entry);
    }

    public TimetableEntry updateTimetableEntry(Long id, TimetableEntry entry) {
        TimetableEntry existing = timetableEntryRepository.findById(id).orElseThrow(NoSuchElementException::new);
        ensureNoTimetableConflict(entry, id);
        existing.setDayOfWeek(entry.getDayOfWeek());
        existing.setClassName(entry.getClassName());
        existing.setSection(entry.getSection());
        existing.setSlot(entry.getSlot());
        existing.setSubject(entry.getSubject());
        existing.setTeacherName(entry.getTeacherName());
        return timetableEntryRepository.save(existing);
    }

    public void deleteTimetableEntry(Long id) {
        timetableEntryRepository.deleteById(id);
    }

    private void ensureNoTimetableConflict(TimetableEntry incoming, Long currentId) {
        String incomingSection = incoming.getSection() == null ? "" : incoming.getSection().trim().toLowerCase();
        boolean conflict = timetableEntryRepository.findAll().stream().anyMatch(existing -> {
            if (currentId != null && currentId.equals(existing.getId())) {
                return false;
            }
            String existingSection = existing.getSection() == null ? "" : existing.getSection().trim().toLowerCase();
            return existing.getDayOfWeek().equalsIgnoreCase(incoming.getDayOfWeek())
                    && existing.getClassName().equalsIgnoreCase(incoming.getClassName())
                    && existingSection.equals(incomingSection)
                    && existing.getSlot().equalsIgnoreCase(incoming.getSlot());
        });

        if (conflict) {
            throw new IllegalArgumentException("Timetable conflict: same class/section/day/slot already exists");
        }
    }

    public Map<String, Long> getDashboardStats() {
        return Map.of(
                "students", studentRepository.count(),
                "teachers", teacherRepository.count(),
                "parents", parentRepository.count()
        );
    }
}
