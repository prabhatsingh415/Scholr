package com.scholr.scholr;

import com.scholr.scholr.entity.*;
import com.scholr.scholr.enums.Role;
import com.scholr.scholr.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.time.LocalDate;

@Configuration
@AllArgsConstructor
public class DataInitializer {

    @Bean
    CommandLineRunner init(
            UserRepository userRepository,
            SubjectRepository subjectRepository,
            BatchRepository batchRepository,
            SemesterRepository semesterRepository,
            DepartmentRepository departmentRepository,
            BCryptPasswordEncoder bCryptPasswordEncoder,
            AdminRepository adminRepository
    ) {
        return args -> {
            // --- 1. Department Setup ---
            Department csDept = new Department();
            csDept.setDeptId("CS-01");
            csDept.setDeptName("Computer Science");
            departmentRepository.save(csDept);

            // --- 2. Semester Setup ---
            Semester sem4 = new Semester();
            sem4.setSemesterNo(4);
            sem4.setYear(2024);
            semesterRepository.save(sem4);

            // --- 3. Batch Setup ---
            Batch batch2026 = new Batch();
            batch2026.setSemester(sem4);
            batch2026.setDepartment(csDept);
            batch2026.setActive(true);
            batch2026.setDeleted(false);
            batchRepository.save(batch2026);

            // --- 4. TEACHER TEST CASES ---
            // Active Teacher (For normal login)
            Teacher teacher = new Teacher();
            teacher.setCollegeId("T-101");
            teacher.setEmail("teacher@scholr.com");
            teacher.setFirstName("Dr. Khushhal");
            teacher.setRole(Role.TEACHER);
            teacher.setVerified(true);
            teacher.setDeleted(false);
            teacher.setDepartment(csDept);
            teacher.setPassword(bCryptPasswordEncoder.encode("Password@123"));
            userRepository.save(teacher);

            // Pre-Deleted Teacher (To test Teacher Soft-Delete status)
            Teacher teacherDel = new Teacher();
            teacherDel.setCollegeId("T-DELETED");
            teacherDel.setFirstName("Old Teacher");
            teacherDel.setRole(Role.TEACHER);
            teacherDel.setVerified(true);
            teacherDel.setDeleted(true); // <--- SOFT DELETED
            teacherDel.setDepartment(csDept);
            teacherDel.setPassword(bCryptPasswordEncoder.encode("Password@123"));
            userRepository.save(teacherDel);

            // --- 5. SUBJECT SETUP ---
            Subject javaSub = new Subject();
            javaSub.setSubjectName("Java Programming");
            javaSub.setSubjectCode("CS401");
            javaSub.setTeacher(teacher);
            javaSub.setSemester(sem4);
            javaSub.setDepartment(csDept);
            subjectRepository.save(javaSub);

            // --- 6. STUDENT TEST CASES ---

            // Case A: Active Student (Iska delete API test karna)
            Student student = new Student();
            student.setCollegeId("ST-01");
            student.setEmail("prabhat@gmail.com");
            student.setFirstName("Prabhat");
            student.setRole(Role.STUDENT);
            student.setDepartment(csDept);
            student.setSemester(sem4);
            student.setBatch(batch2026); // ✅ Linked
            student.setVerified(true);
            student.setDeleted(false);
            student.setCourseName("B.TECH");
            student.setRollNo("ROLL-001");
            student.setCgpa(8.5);
            student.setDateOfJoining(LocalDate.now());
            student.setExpectedDateOfGraduation(LocalDate.now().plusYears(4));
            student.setPassword(bCryptPasswordEncoder.encode("Password@123"));
            userRepository.save(student);

            // Case B: Pre-Deleted Student (To test JWT Filter 403 Message)
            Student studentDel = new Student();
            studentDel.setCollegeId("ST-DELETED");
            studentDel.setFirstName("DeletedUser");
            studentDel.setRole(Role.STUDENT);
            studentDel.setDepartment(csDept);
            studentDel.setSemester(sem4);
            studentDel.setBatch(batch2026); // ✅ Linked
            studentDel.setVerified(true);
            studentDel.setDeleted(true); // <--- SOFT DELETED
            studentDel.setCourseName("B.TECH");
            studentDel.setRollNo("ROLL-DEL");
            studentDel.setCgpa(0.0);
            studentDel.setDateOfJoining(LocalDate.now());
            studentDel.setExpectedDateOfGraduation(LocalDate.now().plusYears(4));
            studentDel.setPassword(bCryptPasswordEncoder.encode("Password@123"));
            userRepository.save(studentDel);

            // Case C: Bulk Deactivation Students (Testing Bulk API)
            for(int i=1; i<=2; i++) {
                Student s = new Student();
                s.setCollegeId("ST-BULK-0" + i);
                s.setFirstName("BulkStudent" + i);
                s.setRole(Role.STUDENT);
                s.setDepartment(csDept); // ✅ Missing Field Fixed
                s.setSemester(sem4);     // ✅ Missing Field Fixed
                s.setBatch(batch2026);   // ✅ Missing Field Fixed (NPE Fix!)
                s.setVerified(true);
                s.setDeleted(false);
                s.setCourseName("B.TECH");
                s.setRollNo("ROLL-B0" + i);
                s.setCgpa(7.0);
                s.setDateOfJoining(LocalDate.now());
                s.setExpectedDateOfGraduation(LocalDate.now().plusYears(4));
                s.setPassword(bCryptPasswordEncoder.encode("Password@123"));
                userRepository.save(s);
            }

            // --- 7. ADMIN SETUP ---
            Admin admin = new Admin();
            admin.setCollegeId("AD-01");
            admin.setPassword(bCryptPasswordEncoder.encode("Password@123"));
            admin.setVerified(true);
            admin.setRole(Role.ADMIN);
            admin.setDepartment(csDept);
            admin.setDeleted(false);
            adminRepository.save(admin);

            System.out.println("🚀 Scholr Demo Data Loaded Successfully with Soft-Delete Cases!");
        };
    }
}