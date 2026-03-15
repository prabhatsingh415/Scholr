package com.scholr.scholr.service;

import com.scholr.scholr.entity.Subject;
import com.scholr.scholr.entity.User;
import io.jsonwebtoken.Claims;
import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService {
    String generateAccessToken(User user);

    String generateRefreshToken(User user);

    String extractUserCollegeId(String token);

    boolean isTokenValid(String token, UserDetails userDetails);

    Claims extractAllClaims(String token, String secretKey);

    String generateTokenWithCustomData(String collegeId, Long sessionId, Integer semesterNo, Subject targetSubject, Double latitude, Double longitude);
}




