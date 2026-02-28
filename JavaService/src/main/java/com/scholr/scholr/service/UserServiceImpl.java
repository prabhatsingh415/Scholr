package com.scholr.scholr.service;

import com.scholr.scholr.dto.*;
import com.scholr.scholr.entity.Student;
import com.scholr.scholr.entity.Teacher;
import com.scholr.scholr.entity.User;
import com.scholr.scholr.enums.Role;
import com.scholr.scholr.exception.*;
import com.scholr.scholr.repository.UserRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Objects;
import java.util.Optional;

@Service
@Slf4j
@AllArgsConstructor
public class UserServiceImpl implements UserService{
    private final UserRepository repository;
    private final CloudinaryService cloudinaryService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;


    @Override
    public Optional<User> findByCollegeId(String collegeId) {
        return repository.findByCollegeId(collegeId);
    }

    @Override
    public void save(User user) {
      repository.save(user);
    }

    @Override
    @Transactional
    @CacheEvict(value = "userProfile", key = "#collegeId")
    public UserDataResponse updateName(UpdateNameRequest request, String collegeId) {
        User user = repository.findByCollegeId(collegeId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));

        boolean isSameName = Objects.equals(user.getFirstName(), request.firstName()) &&
                Objects.equals(user.getLastName(), request.lastName());

        if (isSameName) {
            return this.mapToDTO(user);
        }

        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());

        User updatedUser = repository.save(user);

        return this.mapToDTO(updatedUser);
    }

    @Override
    public UserDataResponse mapToDTO(User user) {

        String collegeId = user.getCollegeId();
        String firstName = user.getFirstName();
        String lastName = user.getLastName();
        String email = user.getEmail();
        Role role = user.getRole();

        Boolean isHod = null;
        Boolean isClassTeacher = null;
        String rollNo = null;
        String batchId = null;
        String courseName = null;

        // Type checking aur casting
        if (user instanceof Teacher teacher) {
            isHod = teacher.isHod();
            isClassTeacher = teacher.isClassTeacher();
        } else if (user instanceof Student student) {
            rollNo = student.getRollNo();
            batchId = student.getBatchId();
            courseName = student.getCourseName();
        }

        return new UserDataResponse(
                collegeId, firstName, lastName, email, role,
                user.getProfilePicURL(), user.getDeptId(), user.isVerified(),
                isHod, isClassTeacher, rollNo, batchId, courseName
        );
    }

    @Override
    @Transactional
    @CacheEvict(value = "userProfile", key = "#collegeId")
    public UserDataResponse updateProfilePic(MultipartFile file, String collegeId) {
        String imageUrl = cloudinaryService.uploadImage(file, "profile_pictures")
                 .orElseThrow(() -> new ImageUploadFailedException("Image upload failed"));

        User user = repository.findByCollegeId(collegeId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        user.setProfilePicURL(imageUrl);
        User updatedUser = repository.save(user);

        return this.mapToDTO(updatedUser);
    }

    @Override
    @CacheEvict(value = "userProfile", key = "#collegeId")
    public void updatePassword(String collegeId, ChangePasswordRequest request) {
        if (!request.newPassword().equals(request.confirmNewPassword())) {
            throw new PasswordMismatchException("New password and confirmation password do not match.");
        }

        User user = repository.findByCollegeId(collegeId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!bCryptPasswordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new InvalidCurrentPasswordException("Current password is incorrect.");
        }

        if (bCryptPasswordEncoder.matches(request.newPassword(), user.getPassword())) {
            throw new PasswordSameAsOldException("New password cannot be the same as the old one.");
        }

        user.setPassword(bCryptPasswordEncoder.encode(request.newPassword()));
        repository.save(user);

        log.info("Password updated for user: {}", collegeId);
    }

    @Override
    @Cacheable(value = "userProfile", key = "#collegeId")
    public DashboardDataResponse getUserProfile(String collegeId) {
        User user = repository.findByCollegeId(collegeId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));

        return this.mapToDashboardDTO(user) ;
    }

    private DashboardDataResponse mapToDashboardDTO(User user) {
        // Common Fields
        String collegeId = user.getCollegeId();
        String firstName = user.getFirstName();
        String lastName = user.getLastName();
        String email = user.getEmail();
        String phoneNo = user.getPhoneNo();
        String profilePicURL = user.getProfilePicURL();
        String deptId = user.getDeptId();
        String role = user.getRole().name();

        // Student Specific Fields
        String rollNo = null;
        String courseName = null;
        String batchId = null;
        Double cgpa = null;
        Integer activeBacklogs = null;


        if (user instanceof Student student) {
            rollNo = student.getRollNo();
            courseName = student.getCourseName();
            batchId = student.getBatchId();
            cgpa = student.getCgpa();
            activeBacklogs = student.getActiveBacklogs();
        }

        return new DashboardDataResponse(
                collegeId,
                firstName,
                lastName,
                email,
                phoneNo,
                profilePicURL,
                deptId,
                role,
                rollNo,
                courseName,
                batchId,
                cgpa,
                activeBacklogs
        );
    }
}
