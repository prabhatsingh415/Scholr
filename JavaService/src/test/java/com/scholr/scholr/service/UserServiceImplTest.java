package com.scholr.scholr.service;

import com.scholr.scholr.dto.ChangePasswordRequest;
import com.scholr.scholr.dto.DashboardDataResponse;
import com.scholr.scholr.dto.UpdateNameRequest;
import com.scholr.scholr.dto.UserDataResponse;
import com.scholr.scholr.entity.Batch;
import com.scholr.scholr.entity.Department;
import com.scholr.scholr.entity.Student;
import com.scholr.scholr.entity.Teacher;
import com.scholr.scholr.entity.User;
import com.scholr.scholr.enums.Role;
import com.scholr.scholr.exception.InvalidCurrentPasswordException;
import com.scholr.scholr.exception.PasswordMismatchException;
import com.scholr.scholr.exception.PasswordSameAsOldException;
import com.scholr.scholr.exception.UserNotFoundException;
import com.scholr.scholr.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CloudinaryService cloudinaryService;

    @Mock
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private User testUser;
    private Student testStudent;
    private Teacher testTeacher;
    private Department testDepartment;
    private Batch testBatch;

    @BeforeEach
    void setUp() {
        testDepartment = new Department();
        testDepartment.setId(1L);
        testDepartment.setDeptId("CS01");
        testDepartment.setDeptName("Computer Science");

        testBatch = new Batch();
        testBatch.setBatchId(1L);

        testStudent = new Student();
        testStudent.setUserId(1L);
        testStudent.setCollegeId("STU001");
        testStudent.setFirstName("John");
        testStudent.setLastName("Doe");
        testStudent.setEmail("john@example.com");
        testStudent.setPassword("hashedPassword");
        testStudent.setRole(Role.STUDENT);
        testStudent.setDepartment(testDepartment);
        testStudent.setBatch(testBatch);
        testStudent.setRollNo("001");
        testStudent.setCourseName("B.Tech");
        testStudent.setVerified(true);

        testTeacher = new Teacher();
        testTeacher.setUserId(2L);
        testTeacher.setCollegeId("TEACH001");
        testTeacher.setFirstName("Jane");
        testTeacher.setLastName("Smith");
        testTeacher.setEmail("jane@example.com");
        testTeacher.setPassword("hashedPassword");
        testTeacher.setRole(Role.TEACHER);
        testTeacher.setDepartment(testDepartment);
        testTeacher.setHod(false);
        testTeacher.setVerified(true);

        testUser = testStudent;
    }

    @Test
    void testFindByCollegeId_ShouldReturnUser() {
        when(userRepository.findByCollegeId("STU001")).thenReturn(Optional.of(testUser));

        Optional<User> result = userService.findByCollegeId("STU001");

        assertThat(result).isPresent();
        assertThat(result.get().getCollegeId()).isEqualTo("STU001");
        verify(userRepository, times(1)).findByCollegeId("STU001");
    }

    @Test
    void testFindByCollegeId_UserNotFound_ShouldReturnEmpty() {
        when(userRepository.findByCollegeId("INVALID")).thenReturn(Optional.empty());

        Optional<User> result = userService.findByCollegeId("INVALID");

        assertThat(result).isEmpty();
        verify(userRepository, times(1)).findByCollegeId("INVALID");
    }

    @Test
    void testSaveUser_ShouldPersistUser() {
        userService.save(testUser);

        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void testUpdateName_WithValidNameChange_ShouldUpdateSuccessfully() {
        UpdateNameRequest request = new UpdateNameRequest("Jane", "Doe");
        when(userRepository.findByCollegeId("STU001")).thenReturn(Optional.of(testUser));
        when(userRepository.save(testUser)).thenReturn(testUser);

        UserDataResponse result = userService.updateName(request, "STU001");

        assertThat(result).isNotNull();
        assertThat(testUser.getFirstName()).isEqualTo("Jane");
        assertThat(testUser.getLastName()).isEqualTo("Doe");
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void testUpdateName_WithSameName_ShouldReturnWithoutUpdate() {
        UpdateNameRequest request = new UpdateNameRequest("John", "Doe");
        when(userRepository.findByCollegeId("STU001")).thenReturn(Optional.of(testUser));

        UserDataResponse result = userService.updateName(request, "STU001");

        assertThat(result).isNotNull();
        verify(userRepository, never()).save(any());
    }

    @Test
    void testUpdateName_UserNotFound_ShouldThrowException() {
        UpdateNameRequest request = new UpdateNameRequest("Jane", "Doe");
        when(userRepository.findByCollegeId("INVALID")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.updateName(request, "INVALID"))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessage("User not found!");
    }

    @Test
    void testMapToDTO_WithStudent_ShouldReturnCorrectData() {
        UserDataResponse result = userService.mapToDTO(testStudent);

        assertThat(result).isNotNull();
        assertThat(result.collegeId()).isEqualTo("STU001");
        assertThat(result.firstName()).isEqualTo("John");
        assertThat(result.rollNo()).isEqualTo("001");
        assertThat(result.isHod()).isNull();
    }

    @Test
    void testMapToDTO_WithTeacher_ShouldReturnCorrectData() {
        UserDataResponse result = userService.mapToDTO(testTeacher);

        assertThat(result).isNotNull();
        assertThat(result.collegeId()).isEqualTo("TEACH001");
        assertThat(result.firstName()).isEqualTo("Jane");
        assertThat(result.isHod()).isFalse();
        assertThat(result.rollNo()).isNull();
    }

    @Test
    void testUpdatePassword_WithValidCurrentPassword_ShouldUpdateSuccessfully() {
        ChangePasswordRequest request = new ChangePasswordRequest(
                "hashedPassword",
                "NewPassword@123",
                "NewPassword@123"
        );

        when(userRepository.findByCollegeId("STU001")).thenReturn(Optional.of(testUser));
        when(bCryptPasswordEncoder.matches("hashedPassword", testUser.getPassword())).thenReturn(true);
        when(bCryptPasswordEncoder.matches("NewPassword@123", testUser.getPassword())).thenReturn(false);
        when(bCryptPasswordEncoder.encode("NewPassword@123")).thenReturn("newHashedPassword");

        userService.updatePassword("STU001", request);

        assertThat(testUser.getPassword()).isEqualTo("newHashedPassword");
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void testUpdatePassword_PasswordMismatch_ShouldThrowException() {
        ChangePasswordRequest request = new ChangePasswordRequest(
                "hashedPassword",
                "NewPassword@123",
                "DifferentPassword@123"
        );

        assertThatThrownBy(() -> userService.updatePassword("STU001", request))
                .isInstanceOf(PasswordMismatchException.class)
                .hasMessage("New password and confirmation password do not match.");
    }

    @Test
    void testUpdatePassword_InvalidCurrentPassword_ShouldThrowException() {
        ChangePasswordRequest request = new ChangePasswordRequest(
                "wrongPassword",
                "NewPassword@123",
                "NewPassword@123"
        );

        when(userRepository.findByCollegeId("STU001")).thenReturn(Optional.of(testUser));
        when(bCryptPasswordEncoder.matches("wrongPassword", testUser.getPassword())).thenReturn(false);

        assertThatThrownBy(() -> userService.updatePassword("STU001", request))
                .isInstanceOf(InvalidCurrentPasswordException.class)
                .hasMessage("Current password is incorrect.");
    }

    @Test
    void testUpdatePassword_SameAsOldPassword_ShouldThrowException() {
        ChangePasswordRequest request = new ChangePasswordRequest(
                "oldHashedPassword",
                "oldHashedPassword",
                "oldHashedPassword"
        );

        when(userRepository.findByCollegeId("STU001")).thenReturn(Optional.of(testUser));
        when(bCryptPasswordEncoder.matches("oldHashedPassword", testUser.getPassword())).thenReturn(true);

        assertThatThrownBy(() -> userService.updatePassword("STU001", request))
                .isInstanceOf(PasswordSameAsOldException.class)
                .hasMessage("New password cannot be the same as the old one.");
    }

    @Test
    void testGetUserProfile_ShouldReturnDashboardData() {
        testStudent.setCgpa(7.5);
        testStudent.setActiveBacklogs(0);

        when(userRepository.findByCollegeId("STU001")).thenReturn(Optional.of(testStudent));

        DashboardDataResponse result = userService.getUserProfile("STU001");

        assertThat(result).isNotNull();
        assertThat(result.collegeId()).isEqualTo("STU001");
        assertThat(result.firstName()).isEqualTo("John");
        assertThat(result.cgpa()).isEqualTo(7.5);
        verify(userRepository, times(1)).findByCollegeId("STU001");
    }

    @Test
    void testGetUserProfile_UserNotFound_ShouldThrowException() {
        when(userRepository.findByCollegeId("INVALID")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getUserProfile("INVALID"))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessage("User not found!");
    }

    @Test
    void testFindByRole_ShouldReturnUsersWithRole() {
        List<User> users = List.of(testStudent);
        when(userRepository.findByRole(Role.STUDENT)).thenReturn(users);

        List<com.scholr.scholr.dto.UserDTO> result = userService.findByRole(Role.STUDENT);

        assertThat(result).isNotNull();
        assertThat(result).hasSize(1);
        verify(userRepository, times(1)).findByRole(Role.STUDENT);
    }

    @Test
    void testFindAllByRole_ShouldReturnAllUsersWithRole() {
        List<User> users = List.of(testStudent);
        when(userRepository.findAllByRole(Role.STUDENT)).thenReturn(users);

        List<User> result = userService.findAllByRole(Role.STUDENT);

        assertThat(result).isNotNull();
        assertThat(result).hasSize(1);
        verify(userRepository, times(1)).findAllByRole(Role.STUDENT);
    }

    @Test
    void testDeleteUser_ShouldRemoveUser() {
        userService.delete(testUser);

        verify(userRepository, times(1)).delete(testUser);
    }

    @Test
    void testDeleteUserById_ShouldRemoveUserByCollegeId() {
        userService.deleteUserById("STU001");

        verify(userRepository, times(1)).deleteByCollegeId("STU001");
    }

    @Test
    void testPrepareUserForVerification_ShouldHashPasswordAndSave() {
        Student unverifiedUser = new Student();
        unverifiedUser.setCollegeId("STU001");
        unverifiedUser.setVerified(false);

        when(userRepository.findByCollegeId("STU001")).thenReturn(Optional.of(unverifiedUser));
        when(bCryptPasswordEncoder.encode("Password@123")).thenReturn("hashedPassword");
        when(userRepository.save(unverifiedUser)).thenReturn(unverifiedUser);

        User result = userService.prepareUserForVerification("STU001", "Password@123");

        assertThat(result).isNotNull();
        assertThat(unverifiedUser.getPassword()).isEqualTo("hashedPassword");
        verify(userRepository, times(1)).save(unverifiedUser);
    }
}
