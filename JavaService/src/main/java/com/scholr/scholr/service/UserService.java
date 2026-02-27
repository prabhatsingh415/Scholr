package com.scholr.scholr.service;


import com.scholr.scholr.entity.User;

import java.util.Optional;

public interface UserService {

    Optional<User> findByCollegeId(String collegeId);

    void save(User user);
}






