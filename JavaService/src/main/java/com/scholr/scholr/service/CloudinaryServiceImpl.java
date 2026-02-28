package com.scholr.scholr.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.scholr.scholr.exception.ImageUploadFailedException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class CloudinaryServiceImpl implements CloudinaryService{

    private final Cloudinary cloudinary;

    @Override
    public Optional<String> uploadImage(MultipartFile file, String folderName) {
        try {
            Map upload = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", folderName,
                    "overwrite", true,
                    "resource_type", "image"
            ));
            log.info("[Cloudinary-Service]: Image uploaded successfully");
            return Optional.of ((String) upload.get("url"));
        } catch (IOException e) {
            log.info("[Cloudinary-Service]: Image Upload failed");
            throw new ImageUploadFailedException("Failed to upload image to Cloudinary");
        }
    }
}
