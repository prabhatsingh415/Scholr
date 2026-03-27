package com.scholr.scholr.service;

import com.scholr.scholr.dto.StudentAddRequest;
import com.scholr.scholr.dto.TeacherAddRequest;
import com.scholr.scholr.dto.UserResponseDTO;
import com.scholr.scholr.entity.*;
import com.scholr.scholr.enums.Role;
import com.scholr.scholr.exception.*;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class AdminUserServiceImpl implements AdminUserService {

    private final UserService userService;
    private final DepartmentService departmentService;
    private final SubjectService subjectService;
    private final TeacherService teacherService;
    private final SemesterService semesterService;
    private final BatchService batchService;
    private final StudentService studentService;


    @Transactional
    @Override
    public List<User> addStudentsBulk(List<StudentAddRequest> requests) {
        return requests.stream()
                .map(this::addStudent)
                .toList();
    }

    @Transactional
    @Override
    public List<User> addTeachersBulk(List<TeacherAddRequest> requests) {
        return requests.stream()
                .map(this::addTeacher)
                .toList();
    }


    @Transactional
    @Override
    public void deleteUsersBulk(List<String> collegeIds) {
        collegeIds.forEach(userService::deleteUserById);
        log.info("Bulk delete completed for {} users.", collegeIds.size());
    }


    @Override
    @Transactional
    public User addStudent(StudentAddRequest request) {
        validateNewUser(request.collegeId());

        Student student = new Student();
        mapCommonUserFields(student, request.firstName(), request.lastName(), request.collegeId(),
                request.email(), request.phoneNo(), request.deptId(), Role.STUDENT);

        // Student Specific
        student.setRollNo(request.rollNo());
        student.setCourseName(request.courseName());
        student.setSemester(semesterService.findById(request.semesterId())
                .orElseThrow(() -> new InvalidSemesterIdException("Invalid semester id")));
        student.setBatch(batchService.findById(request.batchId())
                .orElseThrow(() -> new InvalidBatchIdException("Invalid batch id")));
        student.setDateOfJoining(LocalDate.parse(request.joiningDate()));
        student.setExpectedDateOfGraduation(LocalDate.parse(request.gradDate()));

        return studentService.save(student);
    }

    @Override
    @Transactional
    public User addTeacher(TeacherAddRequest request) {
        validateNewUser(request.collegeId());

        Teacher teacher = new Teacher();
        mapCommonUserFields(teacher, request.firstName(), request.lastName(), request.collegeId(),
                request.email(), request.phoneNo(), request.deptId(), Role.TEACHER);

        teacher.setHod(request.isHod());

        if (request.subjectIds() != null && !request.subjectIds().isEmpty()) {
            List<Subject> subjects = subjectService.findAllById(request.subjectIds());
            subjects.forEach(sub -> sub.setTeacher(teacher));
            teacher.setSubjects(subjects);
        }
        return teacherService.save(teacher);
    }


    @Override
    public List<UserResponseDTO> getUsersByRole(Role role) {
        List<User> users = userService.findAllByRole(role);
        return users.stream().map(this::convertToDTO).toList();
    }

    @Override
    @Transactional
    public void deleteUser(String collegeId) {

        User user = userService.findByCollegeId(collegeId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + collegeId));

        userService.delete(user);

        log.info("User with ID {} soft-deleted successfully.", collegeId);
    }

    private void validateNewUser(String collegeId) {
        if(userService.findByCollegeId(collegeId).isPresent()){
            throw new UserAlreadyExistsException("User with College ID " + collegeId + " already exists!");
        }
    }

    private void mapCommonUserFields(User user, String fName, String lName, String cId,
                                     String email, String phone, Long deptId, Role role) {
        user.setFirstName(fName);
        user.setLastName(lName);
        user.setCollegeId(cId);
        user.setEmail(email);
        user.setPhoneNo(phone);
        user.setRole(role);
        user.setVerified(false);
        user.setPassword(null);

        Department dept = departmentService.findById(deptId)
                .orElseThrow(() -> new InvalidDepartmentIdException("Invalid department id!"));
        user.setDepartment(dept);
    }

    private UserResponseDTO convertToDTO(User user) {
        String deptName = user.getDepartment() != null ? user.getDepartment().getDeptName() : "N/A";

        if (user instanceof Student s) {
            return new UserResponseDTO(s.getUserId(), s.getCollegeId(), s.getFirstName(), s.getLastName(),
                    s.getEmail(), s.getPhoneNo(), s.getRole(), deptName, s.isVerified(),
                    s.getRollNo(), s.getSemester().getSemesterNo(), s.getBatch().getBatchId(), null);
        } else if (user instanceof Teacher t) {
            return new UserResponseDTO(t.getUserId(), t.getCollegeId(), t.getFirstName(), t.getLastName(),
                    t.getEmail(), t.getPhoneNo(), t.getRole(), deptName, t.isVerified(),
                    null, null, null, t.isHod());
        }
        return null;
    }
}
