package com.scholr.scholr.service;


import com.scholr.scholr.dto.*;
import com.scholr.scholr.entity.User;
import com.scholr.scholr.enums.Role;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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

    void delete(User user);

    void deleteUserById(String s);

    List<String> findAllFcmTokensBySemesterAndDepartment(Long id, String deptId);

    User prepareUserForVerification(String collegeId, @NotBlank(message = "Password cannot be empty") @Size(min = 8, max = 50, message = "Password must be between 8 and 50 characters") @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$&~`\\!])(?=.*\\d)[A-Za-z\\d@$&~`\\!]{8,50}$",
            message = "Password must contain at least one uppercase, one lowercase, one number, and one special character (@$&~`!). No dashes allowed."
    ) String password);
}











