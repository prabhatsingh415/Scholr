package com.scholr.scholr.service;

import com.scholr.scholr.entity.Student;
import com.scholr.scholr.entity.User;
import com.scholr.scholr.repository.StudentRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class StudentServiceImpl implements StudentService{

     private final StudentRepository repository;


    @Override
    public User save(Student newStudent) {
        return repository.save(newStudent);
    }
}
