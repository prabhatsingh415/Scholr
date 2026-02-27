package com.scholr.scholr.service;

import com.scholr.scholr.dto.EmailRequest;
import com.scholr.scholr.dto.AuthRequest;
import com.scholr.scholr.dto.TokenData;
import com.scholr.scholr.entity.User;
import com.scholr.scholr.exception.*;
import com.scholr.scholr.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;

@Service
@Slf4j
@AllArgsConstructor
public class UserServiceImpl implements UserService{
    private final UserRepository repository;


    @Override
    public Optional<User> findByCollegeId(String collegeId) {
        return repository.findByCollegeId(collegeId);
    }

    @Override
    public void save(User user) {
      repository.save(user);
    }
}
