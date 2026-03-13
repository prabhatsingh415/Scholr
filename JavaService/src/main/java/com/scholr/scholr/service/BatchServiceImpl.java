package com.scholr.scholr.service;

import com.scholr.scholr.entity.Batch;
import com.scholr.scholr.repository.BatchRepository;
import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class BatchServiceImpl implements BatchService{

    private final BatchRepository repository;

    @Override
    public Optional<Batch> findById(Long id) {
        return repository.findById(id);
    }
}
