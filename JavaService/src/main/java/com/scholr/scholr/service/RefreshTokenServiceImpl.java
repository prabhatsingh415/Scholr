package com.scholr.scholr.service;

import com.scholr.scholr.entity.RefreshToken;
import com.scholr.scholr.repository.RefreshTokenRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class RefreshTokenServiceImpl implements RefreshTokenService{

    private final RefreshTokenRepository repository;

    @Override
    public void saveOrUpdate(RefreshToken newToken) {
        Optional<RefreshToken> existingToken = repository.findByCollegeId(newToken.getCollegeId());

        if (existingToken.isPresent()) {
            RefreshToken tokenToUpdate = existingToken.get();
            tokenToUpdate.setToken(newToken.getToken());
            tokenToUpdate.setExpiryDate(newToken.getExpiryDate());
            repository.save(tokenToUpdate);
            log.info("Refresh Token updated for College ID: {}", newToken.getCollegeId());
        } else {
            repository.save(newToken);
            log.info("New Refresh Token saved for College ID: {}", newToken.getCollegeId());
        }
    }

    @Override
    @Transactional
    public void deleteToken(String collegeId) {
        repository.deleteByCollegeId(collegeId);
    }

    @Override
    public Optional<RefreshToken> findByCollegeId(String collegeId) {
        return repository.findByCollegeId(collegeId);
    }
}
