
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
            // 1. Departments
            Department csDept = createDept(departmentRepository, "CS-01", "Computer Science");
            Department agDept = createDept(departmentRepository, "AG-01", "Agriculture Engineering");

            // 2. Semesters
            Semester sem2 = createSem(semesterRepository, 2, 1); // 1st Year
            Semester sem4 = createSem(semesterRepository, 4, 2); // 2nd Year
            Semester sem6 = createSem(semesterRepository, 6, 3); // 3rd Year

            // 3. Batches
            Batch batchCS2026 = createBatch(batchRepository, csDept, sem4);
            Batch batchAG2026 = createBatch(batchRepository, agDept, sem4);
            Batch batchCS2027 = createBatch(batchRepository, csDept, sem2);

            String commonPass = bCryptPasswordEncoder.encode("Password@123");

            // --- 🚀 TEACHERS ---
            Teacher khushhal = saveTeacher(userRepository, "T-101", "Khushhal", "Sir", "khushhal@scholr.com", csDept, commonPass);
            Teacher gaurav = saveTeacher(userRepository, "T-102", "Gaurav", "Sen", "gaurav@scholr.com", csDept, commonPass);
            Teacher hitesh = saveTeacher(userRepository, "T-103", "Hitesh", "Choudhary", "hitesh@scholr.com", csDept, commonPass);
            Teacher sandesh = saveTeacher(userRepository, "T-104", "Sandesh", "Ji", "sandesh@scholr.com", agDept, commonPass);
            Teacher arpit = saveTeacher(userRepository, "T-105", "Arpit", "Bhayani", "arpit@scholr.com", csDept, commonPass);

            // --- 📚 SUBJECTS ADDED HERE ---
            // CS Subjects (Sem 4)
            saveSubject(subjectRepository, "Java Programming", "CS401", khushhal, sem4, csDept);
            saveSubject(subjectRepository, "System Design", "CS402", gaurav, sem4, csDept);
            saveSubject(subjectRepository, "Database Management", "CS403", arpit, sem4, csDept);

            // CS Subjects (Sem 2)
            saveSubject(subjectRepository, "React Native Mobile", "CS201", hitesh, sem2, csDept);

            // Agriculture Subjects
            saveSubject(subjectRepository, "Soil Science", "AG401", sandesh, sem4, agDept);
            saveSubject(subjectRepository, "Irrigation Systems", "AG402", sandesh, sem4, agDept);

            // --- 🎓 STUDENTS ---
            saveStudent(userRepository, "ST-01", "Prabhat", "Singh", 9.8, csDept, sem4, batchCS2026, commonPass);
            saveStudent(userRepository, "ST-02", "Amit", "Sharma", 8.5, csDept, sem4, batchCS2026, commonPass);
            saveStudent(userRepository, "ST-03", "Rahul", "Verma", 9.2, csDept, sem4, batchCS2026, commonPass);
            saveStudent(userRepository, "ST-04", "Soniya", "Khan", 9.9, csDept, sem2, batchCS2027, commonPass);
            saveStudent(userRepository, "ST-05", "Vikas", "Jain", 7.8, csDept, sem2, batchCS2027, commonPass);
            saveStudent(userRepository, "ST-08", "Anjali", "Meena", 8.1, csDept, sem4, batchCS2026, commonPass);
            saveStudent(userRepository, "ST-06", "Aditya", "Gautam", 9.5, agDept, sem4, batchAG2026, commonPass);
            saveStudent(userRepository, "ST-07", "Priyansh", "Bhatnagar", 8.9, agDept, sem4, batchAG2026, commonPass);


            Admin admin = new Admin();
            admin.setCollegeId("AD-01");
            admin.setPassword(bCryptPasswordEncoder.encode("Password@123"));
            admin.setVerified(true);
            admin.setRole(Role.ADMIN);
            admin.setDepartment(csDept);

            adminRepository.save(admin);


            System.out.println("🚀 Scholr Demo Data Loaded Successfully!");
            System.out.println("-> Branches: CS & Agriculture | Teachers: 5 | Students: 8 | Subjects: 6");
        };

    }

    // --- HELPER METHODS ---

    private void saveSubject(SubjectRepository repo, String name, String code, Teacher t, Semester s, Department d) {
        Subject sub = new Subject();
        sub.setSubjectName(name);
        sub.setSubjectCode(code);
        sub.setTeacher(t);
        sub.setSemester(s);
        sub.setDepartment(d);
        repo.save(sub);
    }

    private Teacher saveTeacher(UserRepository repo, String id, String fname, String lname, String email, Department d, String pass) {
        Teacher t = new Teacher();
        t.setCollegeId(id);
        t.setFirstName(fname);
        t.setLastName(lname);
        t.setEmail(email);
        t.setRole(Role.TEACHER);
        t.setDepartment(d);
        t.setPassword(pass);
        t.setVerified(true);
        return repo.save(t); // Return teacher to link with subjects
    }

    private void saveStudent(UserRepository repo, String id, String fname, String lname, double cgpa,
                             Department d, Semester s, Batch b, String pass) {
        Student st = new Student();
        st.setCollegeId(id);
        st.setFirstName(fname);
        st.setLastName(lname);
        st.setRole(Role.STUDENT);
        st.setDepartment(d);
        st.setSemester(s);
        st.setBatch(b);
        st.setCgpa(cgpa);
        st.setPassword(pass);
        st.setVerified(true);
        st.setCourseName("B.TECH");
        st.setRollNo("R-" + id);
        st.setDateOfJoining(LocalDate.now());
        st.setExpectedDateOfGraduation(LocalDate.now().plusYears(4));
        repo.save(st);
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



}