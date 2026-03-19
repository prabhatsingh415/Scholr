package com.scholr.scholr.service;

import com.scholr.scholr.dto.FetchStudentWithSubRequest;
import com.scholr.scholr.dto.StudentDTO;
import com.scholr.scholr.dto.SubjectData;
import com.scholr.scholr.entity.Teacher;
import com.scholr.scholr.entity.User;
import com.scholr.scholr.exception.StudentCanNotHaveSubjectsException;
import com.scholr.scholr.exception.UserNotFoundException;
import com.scholr.scholr.repository.TeacherRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TeacherServiceImpl implements TeacherService {

    private final UserService userService;
    private final TeacherRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<SubjectData> findSubjects(String collegeId) {

        User user = userService.findByCollegeId(collegeId)
                .orElseThrow(() -> new UserNotFoundException("CollegeId not found!"));

        // Check if the user is actually a Teacher
        if (!(user instanceof Teacher teacher)) {
            throw new StudentCanNotHaveSubjectsException("Access Denied: Only teachers can fetch subjects for attendance.");
        }

        return teacher.getSubjects().stream()
                .map(sub -> new SubjectData(
                        sub.getSubjectName(),
                        sub.getSubjectCode(),
                        sub.getDepartment().getDeptName(),
                        sub.getSemester().getSemesterNo(),
                        sub.getSemester().getYear()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentDTO> fetchStudentWithSub(FetchStudentWithSubRequest request) {
        return userService.fetchStudentWithSub(request);
    }

    @Override
    public User save(Teacher newTeacher) {
        return repository.save(newTeacher);
    }
}