package com.scholr.scholr.dto;

public record StudentDTO(
        Long userId,
        String collegeId,
        String firstName,
        String lastName,
        String profilePicURL
) {}