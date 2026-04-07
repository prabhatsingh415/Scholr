
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

            Department csDept = new Department();
            csDept.setDeptId("CS-01");
            csDept.setDeptName("Computer Science");
            departmentRepository.save(csDept);

            Semester sem4 = new Semester();
            sem4.setSemesterNo(4);
            sem4.setYear(2024);
            semesterRepository.save(sem4);

            Teacher teacher = new Teacher();
            teacher.setCollegeId("T-101");
            teacher.setEmail("teacher@scholr.com");
            teacher.setFirstName("Dr. Khushhal");
            teacher.setRole(Role.TEACHER);
            teacher.setVerified(true);
            teacher.setDepartment(csDept);
            teacher.setPassword(bCryptPasswordEncoder.encode("Password@123"));
            userRepository.save(teacher);


            Subject javaSub = new Subject();
            javaSub.setSubjectName("Java Programming");
            javaSub.setSubjectCode("CS401");
            javaSub.setTeacher(teacher);
            javaSub.setSemester(sem4);
            javaSub.setDepartment(csDept);
            subjectRepository.save(javaSub);


            Batch batch2026 = new Batch();
            batch2026.setSemester(sem4);
            batch2026.setDepartment(csDept);
            batch2026.setActive(true);
            batchRepository.save(batch2026);


            Student student = new Student();
            student.setCollegeId("ST-01");
            student.setEmail("prabhat@gmail.com");
            student.setFirstName("Prabhat");
            student.setLastName("Singh");
            student.setRole(Role.STUDENT);
            student.setDepartment(csDept);
            student.setSemester(sem4);
            student.setBatch(batch2026);
            student.setCourseName("B.TECH");
            student.setRollNo("ROLL-123");
            student.setDateOfJoining(LocalDate.now());
            student.setExpectedDateOfGraduation(LocalDate.now().plusYears(4));
            student.setVerified(true);
            student.setPassword(bCryptPasswordEncoder.encode("Password@123"));
            userRepository.save(student);


            Admin admin = new Admin();
            admin.setCollegeId("AD-01");
            admin.setPassword(bCryptPasswordEncoder.encode("Password@123"));
            admin.setVerified(true);
            admin.setRole(Role.ADMIN);
            admin.setDepartment(csDept);

            adminRepository.save(admin);

            System.out.println("🚀 Scholr Demo Data Loaded Successfully!");
        };
    }
}
