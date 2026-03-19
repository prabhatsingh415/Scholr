package com.scholr.scholr.service;

import com.scholr.scholr.entity.Student;
import com.scholr.scholr.entity.User;

public interface StudentService {
    User save(Student newStudent);
}

