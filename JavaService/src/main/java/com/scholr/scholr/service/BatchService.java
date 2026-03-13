package com.scholr.scholr.service;

import com.scholr.scholr.entity.Batch;

import java.util.Optional;

public interface BatchService {
    Optional<Batch> findById(Long id);
}
