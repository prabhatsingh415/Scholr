package com.scholr.scholr.controller;

import com.scholr.scholr.dto.*;
import com.scholr.scholr.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/users")
@Slf4j
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @PatchMapping("/update-name")
    public ResponseEntity<ApiResponse<UserDataResponse>> updateName(@Valid @RequestBody UpdateNameRequest request,
                                        @AuthenticationPrincipal UserDetails userDetails){
         UserDataResponse userData =  userService.updateName(request, userDetails.getUsername());

         return ResponseEntity.ok(new ApiResponse<>(
                 true,
                 "Name updated successfully !",
                  userData,
                 null,
                 LocalDateTime.now().toString()
         ));
    }


    @PutMapping("/profile-pic")
    public ResponseEntity<ApiResponse<UserDataResponse>> updateProfilePic(@RequestParam("file") MultipartFile file, @AuthenticationPrincipal UserDetails userDetails){

        UserDataResponse response = userService.updateProfilePic(file, userDetails.getUsername());

        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Image uploaded successfully.",
           response,
                null,
                LocalDateTime.now().toString()
        ));
    }

    @PatchMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(@Valid @RequestBody ChangePasswordRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        String collegeId = userDetails.getUsername();

        userService.updatePassword(collegeId, request);

        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Password changed successfully.",
                "",
                null,
                LocalDateTime.now().toString()
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<DashboardDataResponse>> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        DashboardDataResponse response = userService.getUserProfile(userDetails.getUsername());
        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Profile fetched successfully",
                                response,
                                null,
                                LocalDateTime.now().toString()
           ));
    }

}
