package com.scholr.scholr.service;


import com.scholr.scholr.dto.*;
import com.scholr.scholr.entity.User;
import com.scholr.scholr.enums.Role;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface UserService {

    Optional<User> findByCollegeId(String collegeId);

    void save(User user);

    UserDataResponse updateName(@Valid UpdateNameRequest request, String collegeId);

    UserDataResponse mapToDTO(User user);

    UserDataResponse updateProfilePic(MultipartFile file, String collegeId);

    void updatePassword(String collegeId, @Valid ChangePasswordRequest request);

    DashboardDataResponse getUserProfile(String collegeId);

    List<StudentDTO> fetchStudentWithSub(FetchStudentWithSubRequest request);

    List<UserDTO> findByRole(Role role);

    List<User> findAllByRole(Role role);
}









