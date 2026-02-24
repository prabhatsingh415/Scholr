package com.scholr.scholr.service;

import lombok.AllArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;


import java.util.Random;

@Service
@AllArgsConstructor
public class OTPServiceImpl implements OTPService{

    @Override
    public String generateOTP(int size) {
        StringBuilder otp = new StringBuilder();
        Random random = new Random();

        for (int i = 0; i < size; i++) {
            otp.append(random.nextInt(10));
        }

        return otp.toString();
    }
}
