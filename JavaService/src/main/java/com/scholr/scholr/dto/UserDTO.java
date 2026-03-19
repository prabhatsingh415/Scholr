package com.scholr.scholr.dto;


import com.scholr.scholr.enums.Role;

public record UserDTO(
        Long userId,
        String firstName,
        String lastName,
        String collegeId,
        Role role,
        String departmentName
) {}