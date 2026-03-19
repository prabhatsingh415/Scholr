package com.scholr.scholr.service;

import com.scholr.scholr.dto.StudentAddRequest;
import com.scholr.scholr.dto.TeacherAddRequest;
import com.scholr.scholr.dto.UserResponseDTO;
import com.scholr.scholr.entity.User;
import com.scholr.scholr.enums.Role;
import jakarta.transaction.Transactional;

import java.util.List;

public interface AdminUserService {

    @Transactional
    List<User> addStudentsBulk(List<StudentAddRequest> requests);

    @Transactional
    List<User> addTeachersBulk(List<TeacherAddRequest> requests);

//    @Transactional
//    void deleteUsersBulk(List<Long> ids);

    User addStudent(StudentAddRequest request);

    User addTeacher(TeacherAddRequest request);

    List<UserResponseDTO> getUsersByRole(Role role);
}


