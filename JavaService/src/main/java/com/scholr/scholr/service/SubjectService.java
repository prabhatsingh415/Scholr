package com.scholr.scholr.service;

import com.scholr.scholr.entity.Subject;

import java.util.List;

public interface SubjectService {
    List<Subject> findAllById(List<Long> longs);
}

