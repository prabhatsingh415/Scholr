
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
            SemesterRepository semesterRepository,
            DepartmentRepository departmentRepository,
            BatchRepository batchRepository,
            BCryptPasswordEncoder bCryptPasswordEncoder
    ) {
        return args -> {
            // 1. Departments
            Department csDept = createDept(departmentRepository, "CS-01", "Computer Science");
            Department meDept = createDept(departmentRepository, "ME-01", "Mechanical Engineering");

            // 2. Semesters (Academic Years)
            Semester sem2 = createSem(semesterRepository, 2, 1); // 1st Year
            Semester sem4 = createSem(semesterRepository, 4, 2); // 2nd Year
            Semester sem6 = createSem(semesterRepository, 6, 3); // 3rd Year

            // 3. Batches
            Batch batch2027 = createBatch(batchRepository, csDept, sem2);
            Batch batch2026 = createBatch(batchRepository, csDept, sem4);
            Batch batch2025 = createBatch(batchRepository, meDept, sem6);

            String commonPass = bCryptPasswordEncoder.encode("Password@123");

            // 4. Students - CS Dept - 2nd Year (Batch 2026)
            saveStudent(userRepository, "ST-01", "Prabhat", "Singh", 9.8, csDept, sem4, batch2026, commonPass);
            saveStudent(userRepository, "ST-02", "Amit", "Sharma", 8.5, csDept, sem4, batch2026, commonPass);
            saveStudent(userRepository, "ST-03", "Rahul", "Verma", 9.2, csDept, sem4, batch2026, commonPass);

            // 5. Students - CS Dept - 1st Year (Batch 2027)
            saveStudent(userRepository, "ST-04", "Soniya", "Khan", 9.9, csDept, sem2, batch2027, commonPass);
            saveStudent(userRepository, "ST-05", "Vikas", "Jain", 7.8, csDept, sem2, batch2027, commonPass);

            // 6. Students - Mechanical Dept - 3rd Year (Batch 2025)
            saveStudent(userRepository, "ST-06", "Aditya", "Gautam", 9.5, meDept, sem6, batch2025, commonPass);
            saveStudent(userRepository, "ST-07", "Priyansh", "Bhatnagar", 8.9, meDept, sem6, batch2025, commonPass);

            System.out.println("🚀 Scholr Ranking Test Data Loaded!");
            System.out.println("-> Total 7 Students across 2 Depts and 3 Years added.");
        };
    }

    private Department createDept(DepartmentRepository repo, String id, String name) {
        Department d = new Department();
        d.setDeptId(id); d.setDeptName(name);
        return repo.save(d);
    }

    private Semester createSem(SemesterRepository repo, int num, int year) {
        Semester s = new Semester();
        s.setSemesterNo(num); s.setYear(year);
        return repo.save(s);
    }

    private Batch createBatch(BatchRepository repo, Department d, Semester s) {
        Batch b = new Batch();
        b.setDepartment(d); b.setSemester(s); b.setActive(true);
        return repo.save(b);
    }

    private void saveStudent(UserRepository repo, String id, String fname, String lname, double cgpa,
                             Department d, Semester s, Batch b, String pass) {
        Student st = new Student();
        st.setCollegeId(id); st.setFirstName(fname); st.setLastName(lname);
        st.setRole(Role.STUDENT); st.setDepartment(d); st.setSemester(s);
        st.setBatch(b); st.setCgpa(cgpa); st.setPassword(pass);
        st.setVerified(true); st.setCourseName("B.TECH"); st.setRollNo("R-"+id);
        st.setDateOfJoining(LocalDate.now());
        st.setExpectedDateOfGraduation(LocalDate.now().plusYears(4));
        repo.save(st);
    }
}