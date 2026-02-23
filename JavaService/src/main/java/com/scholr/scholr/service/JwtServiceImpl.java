package com.scholr.scholr.service;

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

@Service
public class JwtServiceImpl implements JwtService {

    @Value("${JWT_SECRET}")
    private String secretKey;


    @Override
    public String generateAccessToken(User user) {
        Map<String, Object> claims = this.generateClaims(user);

        long expirationTime = 30 * 60 * 1000;

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getCollegeId())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(this.getSecretKey(), SignatureAlgorithm.HS256)
                .compact();
    }


    @Override
    public String generateRefreshToken(User user) {
        long refreshExpiration = 3888000000L;

        return Jwts.builder()
                .setSubject(user.getCollegeId())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpiration))
                .signWith(this.getSecretKey(), SignatureAlgorithm.HS256)
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
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(this.getSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }


    private SecretKey getSecretKey() {
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

        return claims;
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private boolean isTokenExpired(String token) {
        return this.extractClaim(token, Claims::getExpiration).before(new Date());
    }

}
