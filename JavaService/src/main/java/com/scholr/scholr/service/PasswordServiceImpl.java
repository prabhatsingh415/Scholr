package com.scholr.scholr.service;

import com.scholr.scholr.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class PasswordServiceImpl implements PasswordService{

    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public boolean isPasswordValid(User user, String password) {
     return passwordEncoder.matches(password, user.getPassword());
    }

    @Override
    public String hashPassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }
}
