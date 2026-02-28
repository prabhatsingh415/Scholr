package com.scholr.scholr.service;


import com.scholr.scholr.dto.ChangePasswordRequest;
import com.scholr.scholr.dto.DashboardDataResponse;
import com.scholr.scholr.dto.UpdateNameRequest;
import com.scholr.scholr.dto.UserDataResponse;
import com.scholr.scholr.entity.User;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

public interface UserService {

    Optional<User> findByCollegeId(String collegeId);

    void save(User user);

    UserDataResponse updateName(@Valid UpdateNameRequest request, String collegeId);

    UserDataResponse mapToDTO(User user);

    UserDataResponse updateProfilePic(MultipartFile file, String collegeId);

    void updatePassword(String collegeId, @Valid ChangePasswordRequest request);

    DashboardDataResponse getUserProfile(String collegeId);
}







