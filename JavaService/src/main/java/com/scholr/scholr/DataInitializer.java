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
    @Bean
    CommandLineRunner init() {
        return args -> {
            // Fake user for testing
            Student student = new Student();

            student.setCollegeId("ST-2026-01");
            student.setEmail("singh.prabhat.work@gmail.com");
            student.setFirstName("Prabhat");
            student.setLastName("Singh");
            student.setProfilePicURL("https://imgs.search.brave.com/N-71SpwQQGrXeSNfoMLUzZhArSD-kI-Bm9RxQ5y7CBs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzQxLzU4/L2FlLzQxNThhZWQz/NTZjZDQwYzhiYmVh/MzM1MmI4MjhhMjY0/LmpwZw");
            student.setBatchId("2022_CS_ON_TOP");
            student.setRole(Role.STUDENT);
            student.setBatchId("45578");
            student.setRollNo("458745697");
            student.setCourseName("B.TECH");
            student.setDateOfJoining(LocalDate.now());
            student.setExpectedDateOfGraduation(LocalDate.now().plusMonths(1));


            userRepository.save(student);
            System.out.println("✅ Testing User Createdy790: ST-2026-01 / Password@123");
        };
    }
}