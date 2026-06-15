package com.school.schoolsystem.config;

import com.school.schoolsystem.entity.AppUser;
import com.school.schoolsystem.entity.Parent;
import com.school.schoolsystem.entity.Student;
import com.school.schoolsystem.entity.Teacher;
import com.school.schoolsystem.entity.TimetableEntry;
import com.school.schoolsystem.repository.AppUserRepository;
import com.school.schoolsystem.repository.ParentRepository;
import com.school.schoolsystem.repository.StudentRepository;
import com.school.schoolsystem.repository.TeacherRepository;
import com.school.schoolsystem.repository.TimetableEntryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seedDemoData(
            StudentRepository studentRepository,
            TeacherRepository teacherRepository,
            ParentRepository parentRepository,
            TimetableEntryRepository timetableEntryRepository,
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            seedStudents(studentRepository);
            seedTeachers(teacherRepository);
            seedParents(parentRepository, studentRepository);
            seedTimetable(timetableEntryRepository);
            seedUsers(appUserRepository, passwordEncoder);
        };
    }

    private void seedStudents(StudentRepository studentRepository) {
        saveStudentIfMissing(studentRepository, "Aarav Sharma", "10th Grade", "A", "+91 98765 10001", "Delhi", 15);
        saveStudentIfMissing(studentRepository, "Priya Singh", "9th Grade", "A", "+91 98765 10002", "Mumbai", 14);
        saveStudentIfMissing(studentRepository, "Rohan Gupta", "10th Grade", "B", "+91 98765 10003", "Pune", 15);
        saveStudentIfMissing(studentRepository, "Ananya Patel", "8th Grade", "A", "+91 98765 10004", "Ahmedabad", 13);
        saveStudentIfMissing(studentRepository, "Vihaan Kumar", "9th Grade", "B", "+91 98765 10005", "Jaipur", 14);
    }

    private void saveStudentIfMissing(
            StudentRepository repository,
            String name,
            String grade,
            String section,
            String contact,
            String address,
            int age
    ) {
        boolean exists = repository.findAll().stream()
                .anyMatch(student -> student.getName().equalsIgnoreCase(name));
        if (!exists) {
            repository.save(new Student(name, grade, section, contact, address, true, age));
        }
    }

    private void seedTeachers(TeacherRepository teacherRepository) {
        saveTeacherIfMissing(teacherRepository, "Neha Mehta", "Mathematics", "+91 98765 20001", "Delhi", "10th-A");
        saveTeacherIfMissing(teacherRepository, "Rahul Verma", "Science", "+91 98765 20002", "Mumbai", "9th-A");
        saveTeacherIfMissing(teacherRepository, "Kavita Joshi", "English", "+91 98765 20003", "Pune", "10th-B");
        saveTeacherIfMissing(teacherRepository, "Amit Desai", "Computer Science", "+91 98765 20004", "Ahmedabad", "8th-A");
        saveTeacherIfMissing(teacherRepository, "Sneha Iyer", "History", "+91 98765 20005", "Jaipur", "9th-B");
    }

    private void saveTeacherIfMissing(
            TeacherRepository repository,
            String name,
            String subject,
            String contact,
            String address,
            String assignedClass
    ) {
        boolean exists = repository.findAll().stream()
                .anyMatch(teacher -> teacher.getName().equalsIgnoreCase(name));
        if (!exists) {
            repository.save(new Teacher(name, subject, contact, address, assignedClass, true));
        }
    }

    private void seedParents(ParentRepository parentRepository, StudentRepository studentRepository) {
        saveParentIfMissing(parentRepository, studentRepository, "Riya Sharma", "+91 98765 30001", "Delhi", "Aarav Sharma");
        saveParentIfMissing(parentRepository, studentRepository, "Raj Singh", "+91 98765 30002", "Mumbai", "Priya Singh");
        saveParentIfMissing(parentRepository, studentRepository, "Meera Gupta", "+91 98765 30003", "Pune", "Rohan Gupta");
        saveParentIfMissing(parentRepository, studentRepository, "Sanjay Patel", "+91 98765 30004", "Ahmedabad", "Ananya Patel");
        saveParentIfMissing(parentRepository, studentRepository, "Deepa Kumar", "+91 98765 30005", "Jaipur", "Vihaan Kumar");
    }

    private void saveParentIfMissing(
            ParentRepository parentRepository,
            StudentRepository studentRepository,
            String name,
            String contact,
            String address,
            String studentName
    ) {
        boolean exists = parentRepository.findAll().stream()
                .anyMatch(parent -> parent.getName().equalsIgnoreCase(name));
        if (exists) {
            return;
        }

        Long studentId = null;
        if (studentRepository != null) {
            studentId = studentRepository.findAll().stream()
                    .filter(student -> student.getName().equalsIgnoreCase(studentName))
                    .map(Student::getId)
                    .findFirst()
                    .orElse(null);
        }

        parentRepository.save(new Parent(name, contact, address, true, studentId));
    }

    private void seedTimetable(TimetableEntryRepository timetableEntryRepository) {
        if (timetableEntryRepository.count() > 0) {
            return;
        }

        timetableEntryRepository.save(new TimetableEntry("Monday", "10th", "A", "P1", "Mathematics", "Neha Mehta"));
        timetableEntryRepository.save(new TimetableEntry("Monday", "10th", "A", "P2", "Science", "Rahul Verma"));
        timetableEntryRepository.save(new TimetableEntry("Tuesday", "9th", "A", "P1", "English", "Kavita Joshi"));
    }

    private void seedUsers(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        saveUserIfMissing(appUserRepository, passwordEncoder, "student1", "student@123", "student", "Aarav Sharma");
        saveUserIfMissing(appUserRepository, passwordEncoder, "student2", "student@123", "student", "Priya Singh");
        saveUserIfMissing(appUserRepository, passwordEncoder, "student3", "student@123", "student", "Rohan Gupta");
        saveUserIfMissing(appUserRepository, passwordEncoder, "student4", "student@123", "student", "Ananya Patel");
        saveUserIfMissing(appUserRepository, passwordEncoder, "student5", "student@123", "student", "Vihaan Kumar");

        saveUserIfMissing(appUserRepository, passwordEncoder, "teacher1", "teacher@123", "teacher", "Neha Mehta");
        saveUserIfMissing(appUserRepository, passwordEncoder, "teacher2", "teacher@123", "teacher", "Rahul Verma");
        saveUserIfMissing(appUserRepository, passwordEncoder, "teacher3", "teacher@123", "teacher", "Kavita Joshi");
        saveUserIfMissing(appUserRepository, passwordEncoder, "teacher4", "teacher@123", "teacher", "Amit Desai");
        saveUserIfMissing(appUserRepository, passwordEncoder, "teacher5", "teacher@123", "teacher", "Sneha Iyer");

        saveUserIfMissing(appUserRepository, passwordEncoder, "admin1", "admin@123", "admin", "System Admin");
        saveUserIfMissing(appUserRepository, passwordEncoder, "admin2", "admin@123", "admin", "Principal Admin");
        saveUserIfMissing(appUserRepository, passwordEncoder, "admin3", "admin@123", "admin", "Academic Admin");
        saveUserIfMissing(appUserRepository, passwordEncoder, "admin4", "admin@123", "admin", "Finance Admin");
        saveUserIfMissing(appUserRepository, passwordEncoder, "admin5", "admin@123", "admin", "Support Admin");

        saveUserIfMissing(appUserRepository, passwordEncoder, "parent1", "parent@123", "parent", "Riya Sharma");
        saveUserIfMissing(appUserRepository, passwordEncoder, "parent2", "parent@123", "parent", "Raj Singh");
        saveUserIfMissing(appUserRepository, passwordEncoder, "parent3", "parent@123", "parent", "Meera Gupta");
        saveUserIfMissing(appUserRepository, passwordEncoder, "parent4", "parent@123", "parent", "Sanjay Patel");
        saveUserIfMissing(appUserRepository, passwordEncoder, "parent5", "parent@123", "parent", "Deepa Kumar");
    }

    private void saveUserIfMissing(
            AppUserRepository repository,
            PasswordEncoder passwordEncoder,
            String username,
            String password,
            String role,
            String fullName
    ) {
        if (!repository.existsByUsername(username)) {
            repository.save(new AppUser(username, passwordEncoder.encode(password), role, fullName));
        }
    }
}
