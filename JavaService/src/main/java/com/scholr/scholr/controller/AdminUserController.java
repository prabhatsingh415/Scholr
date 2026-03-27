package com.scholr.scholr.controller;

import com.scholr.scholr.dto.ApiResponse;
import com.scholr.scholr.dto.StudentAddRequest;
import com.scholr.scholr.dto.TeacherAddRequest;
import com.scholr.scholr.dto.UserDTO;
import com.scholr.scholr.enums.Role;
import com.scholr.scholr.service.AdminUserService;
import com.scholr.scholr.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@AllArgsConstructor
public class AdminUserController {

    private final UserService userService;
    private final AdminUserService adminUserService;



    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getUsers(@RequestParam Role role) {
        List<UserDTO> users = userService.findByRole(role);
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Users fetched successfully",
                users,
                null,
                LocalDateTime.now().toString()
        ));
    }


    @PostMapping("/students")
    public ResponseEntity<?> addStudent(@RequestBody StudentAddRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Student added", adminUserService.addStudent(request), null, LocalDateTime.now().toString()));
    }


    @PostMapping("/teachers")
    public ResponseEntity<?> addTeacher(@RequestBody TeacherAddRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Teacher added", adminUserService.addTeacher(request), null, LocalDateTime.now().toString()));
    }


    // --- Bulk Add ---
    @PostMapping("/students/bulk")
    public ResponseEntity<?> addStudentsBulk(@RequestBody List<StudentAddRequest> requests) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Students added successfully",
                adminUserService.addStudentsBulk(requests),
                null,
                LocalDateTime.now().toString()
        ));
    }

    @PostMapping("/teachers/bulk")
    public ResponseEntity<?> addTeachersBulk(@RequestBody List<TeacherAddRequest> requests) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Teachers added successfully",
                adminUserService.addTeachersBulk(requests),
                null,
                LocalDateTime.now().toString()
        ));
    }

    // --- Bulk Delete ---
    @PatchMapping("/users/bulk-deactivate")
    public ResponseEntity<?> deactivateUsers(@RequestBody List<String> collegeIds) {
        adminUserService.deleteUsersBulk(collegeIds);
        return ResponseEntity.ok(new ApiResponse<>(true, "Users deactivated", null, null, LocalDateTime.now().toString()));
    }


    @DeleteMapping("/users/{collegeId}")
    public ResponseEntity<?> deleteUser(@PathVariable String collegeId) {
        adminUserService.deleteUser(collegeId);
        return ResponseEntity.ok(new ApiResponse<>(true, "User deleted from system", null, null, LocalDateTime.now().toString()));
    }

}