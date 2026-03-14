package com.scholr.scholr;

import com.scholr.scholr.entity.*;
import com.scholr.scholr.enums.Role;
import com.scholr.scholr.repository.BatchRepository;
import com.scholr.scholr.repository.SemesterRepository;
import com.scholr.scholr.repository.SubjectRepository;
import com.scholr.scholr.repository.UserRepository;
import com.scholr.scholr.service.PasswordService;
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
            BCryptPasswordEncoder bCryptPasswordEncoder
    ) {
        return args -> {



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
            teacher.setPassword(bCryptPasswordEncoder.encode("Password@123"));
            userRepository.save(teacher);


            Subject javaSub = new Subject();
            javaSub.setSubjectName("Java Programming");
            javaSub.setSubjectCode("CS401");
            javaSub.setTeacher(teacher);
            javaSub.setSemester(sem4);
            subjectRepository.save(javaSub);

            // 4. Batch Create Karo
            Batch batch2026 = new Batch();
            batch2026.setSemester(sem4);
            batch2026.setActive(true);
            batchRepository.save(batch2026);

            Student student = new Student();
            student.setCollegeId("ST-01");
            student.setEmail("prabhat@gmail.com");
            student.setFirstName("Prabhat");
            student.setLastName("Singh");
            student.setRole(Role.STUDENT);
            student.setBatch(batch2026);
            student.setCourseName("B.TECH");
            student.setRollNo("ROLL-123");
            student.setDateOfJoining(LocalDate.now());
            student.setExpectedDateOfGraduation(LocalDate.now().plusYears(4));
            student.setCgpa(0.0);
            student.setVerified(true);

            student.setPassword(bCryptPasswordEncoder.encode("Password@123"));

            userRepository.save(student);

            System.out.println("🚀 Testing Data Loaded Successfully!");

            System.out.println("🚀 Testing Data Loaded!");
            System.out.println("Teacher ID: T-101 | Batch ID: " + batch2026.getBatchId());
        };
    }
}