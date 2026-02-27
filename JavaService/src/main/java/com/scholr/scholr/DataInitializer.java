package com.scholr.scholr;

import com.scholr.scholr.entity.Student;
import com.scholr.scholr.enums.Role;
import com.scholr.scholr.repository.UserRepository;
import com.scholr.scholr.service.PasswordService;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
@AllArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordService passwordService;

    @Bean
    CommandLineRunner init() {
        return args -> {
            // Fake user for testing
            Student student = new Student();

            student.setCollegeId("ST-2026-01");
            student.setEmail("singh.prabhat.work@gmail.com");
            student.setRole(Role.STUDENT);
            student.setBatchId("45578");
            student.setRollNo("458745697");
            student.setCourseName("BTECH");
            student.setDateOfJoining(LocalDate.now());
            student.setExpectedDateOfGraduation(LocalDate.now().plusMonths(1));


            userRepository.save(student);
            System.out.println("✅ Testing User Created: ST-2026-01 / Password@123");
        };
    }
}