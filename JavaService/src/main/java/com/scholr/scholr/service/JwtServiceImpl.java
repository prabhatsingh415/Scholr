package com.scholr.scholr.service;

import com.scholr.scholr.entity.Student;
import com.scholr.scholr.entity.Subject;
import com.scholr.scholr.entity.Teacher;
import com.scholr.scholr.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Slf4j
@Service
public class JwtServiceImpl implements JwtService {

    @Value("${JWT_SECRET}")
    private String secretKey;

    @Value("${QR_SECRET}")
    private String qrSecret;


    @Override
    public String generateAccessToken(User user) {
        Map<String, Object> claims = this.generateClaims(user);

        long expirationTime = 30 * 60 * 1000;

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getCollegeId())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(this.getSecretKey(secretKey), SignatureAlgorithm.HS256)
                .compact();
    }


    @Override
    public String generateRefreshToken(User user) {
        long refreshExpiration = 3888000000L;

        return Jwts.builder()
                .setSubject(user.getCollegeId())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpiration))
                .signWith(this.getSecretKey(secretKey), SignatureAlgorithm.HS256)
                .compact();
    }

    @Override
    public String extractUserCollegeId(String token) {
        return this.extractClaim(token, Claims::getSubject);
    }


    @Override
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String reqCollegeId = this.extractUserCollegeId(token);
        return reqCollegeId.equals(userDetails.getUsername()) && !this.isTokenExpired(token);
    }

    @Override
    public Claims extractAllClaims(String token, String secretKey) {
        return Jwts.parserBuilder()
                .setSigningKey(this.getSecretKey(secretKey))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    @Override
    public String generateTokenWithCustomData(String collegeId, Long sessionId, Long batchId, Subject targetSubject, Double latitude, Double longitude) {

        Map<String, Object> claims = new HashMap<>();
        claims.put("college_id", collegeId);
        claims.put("sid", sessionId);
        claims.put("bid", batchId);
        claims.put("sub", targetSubject.getSubjectName());
        claims.put("lat", latitude);
        claims.put("lng", longitude);

        long expirationTime = 30 * 60 * 1000;

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(collegeId)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(this.getSecretKey(qrSecret), SignatureAlgorithm.HS256)
                .compact();
    }


    private SecretKey getSecretKey(String secretKey) {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Map<String, Object> generateClaims(User user) {
        Map<String, Object> claims = new HashMap<>();

        claims.put("college_id", user.getCollegeId());
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole());
        claims.put("first_name", user.getFirstName());
        claims.put("last_name", user.getLastName());
        claims.put("is_verified", user.isVerified());

        if (user instanceof Teacher teacher) {
            claims.put("is_hod", teacher.isHod());
        } else if (user instanceof Student student) {
            claims.put("batch_id", student.getBatch().getBatchId());
            claims.put("roll_no", student.getRollNo());
        }
        return claims;
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token, secretKey);
        return claimsResolver.apply(claims);
    }

    private boolean isTokenExpired(String token) {
        return this.extractClaim(token, Claims::getExpiration).before(new Date());
    }

}
