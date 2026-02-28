package com.scholr.scholr.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

public interface CloudinaryService {
    Optional<String> uploadImage(MultipartFile file, String folderName);
}
