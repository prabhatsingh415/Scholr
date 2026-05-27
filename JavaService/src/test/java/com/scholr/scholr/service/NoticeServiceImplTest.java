package com.scholr.scholr.service;

import com.scholr.scholr.dto.NoticeRequest;
import com.scholr.scholr.entity.Admin;
import com.scholr.scholr.entity.Department;
import com.scholr.scholr.entity.Notice;
import com.scholr.scholr.entity.Student;
import com.scholr.scholr.entity.Teacher;
import com.scholr.scholr.enums.NoticeCategory;
import com.scholr.scholr.enums.NoticeScope;
import com.scholr.scholr.enums.Role;
import com.scholr.scholr.repository.DepartmentRepository;
import com.scholr.scholr.repository.NoticeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NoticeServiceImplTest {

    @Mock
    private NoticeRepository noticeRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @InjectMocks
    private NoticeServiceImpl noticeService;

    private Notice testNotice;
    private Department testDepartment;
    private Teacher teacherUser;
    private Admin adminUser;
    private Student studentUser;
    private NoticeRequest noticeRequest;

    @BeforeEach
    void setUp() {
        testDepartment = new Department();
        testDepartment.setId(1L);
        testDepartment.setDeptName("Computer Science");

        teacherUser = new Teacher();
        teacherUser.setUserId(1L);
        teacherUser.setCollegeId("TEACH001");
        teacherUser.setRole(Role.TEACHER);
        teacherUser.setDepartment(testDepartment);

        adminUser = new Admin();
        adminUser.setUserId(2L);
        adminUser.setCollegeId("ADMIN001");
        adminUser.setRole(Role.ADMIN);

        studentUser = new Student();
        studentUser.setUserId(3L);
        studentUser.setCollegeId("STU001");
        studentUser.setRole(Role.STUDENT);
        studentUser.setDepartment(testDepartment);

        noticeRequest = new NoticeRequest(
                "Test Notice",
                "Test Content",
                "https://example.com",
                NoticeScope.PRIVATE,
                NoticeCategory.GENERAL,
                1L
        );

        testNotice = new Notice();
        testNotice.setId(1L);
        testNotice.setTitle("Test Notice");
        testNotice.setContent("Test Content");
        testNotice.setAuthor(teacherUser);
        testNotice.setDepartment(testDepartment);
        testNotice.setScope(NoticeScope.PRIVATE);
        testNotice.setCategory(NoticeCategory.GENERAL);
    }

    @Test
    void testCreateNoticeByTeacher_ShouldSetDepartmentFromTeacher() {
        when(noticeRepository.save(any(Notice.class))).thenReturn(testNotice);

        Notice result = noticeService.createNotice(noticeRequest, teacherUser);

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Test Notice");
        assertThat(result.getAuthor()).isEqualTo(teacherUser);
        verify(noticeRepository, times(1)).save(any(Notice.class));
    }

    @Test
    void testCreateNoticeByAdminWithDepartment_ShouldSetSpecifiedDepartment() {
        NoticeRequest adminRequest = new NoticeRequest(
                "Admin Notice",
                "Admin Content",
                "https://example.com",
                NoticeScope.PUBLIC,
                NoticeCategory.GENERAL,
                1L
        );

        when(departmentRepository.findById(1L)).thenReturn(Optional.of(testDepartment));
        when(noticeRepository.save(any(Notice.class))).thenReturn(testNotice);

        Notice result = noticeService.createNotice(adminRequest, adminUser);

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Test Notice");
        verify(noticeRepository, times(1)).save(any(Notice.class));
    }

    @Test
    void testCreateNoticeByAdminWithoutDepartment_ShouldCreateGeneralNotice() {
        NoticeRequest generalRequest = new NoticeRequest(
                "General Notice",
                "General Content",
                "https://example.com",
                NoticeScope.PUBLIC,
                NoticeCategory.GENERAL,
                null
        );

        when(noticeRepository.save(any(Notice.class))).thenReturn(testNotice);

        Notice result = noticeService.createNotice(generalRequest, adminUser);

        assertThat(result).isNotNull();
        verify(noticeRepository, times(1)).save(any(Notice.class));
    }

    @Test
    void testGetNoticesForAdmin_ShouldReturnAllNotices() {
        List<Notice> expectedNotices = List.of(testNotice);
        when(noticeRepository.findAll()).thenReturn(expectedNotices);

        List<Notice> result = noticeService.getNoticesForUser(adminUser);

        assertThat(result).isNotNull();
        assertThat(result).hasSize(1);
        verify(noticeRepository, times(1)).findAll();
    }

    @Test
    void testGetNoticesForStudent_ShouldReturnRelevantNotices() {
        List<Notice> expectedNotices = List.of(testNotice);
        when(noticeRepository.findRelevantNotices(1L)).thenReturn(expectedNotices);

        List<Notice> result = noticeService.getNoticesForUser(studentUser);

        assertThat(result).isNotNull();
        assertThat(result).hasSize(1);
        verify(noticeRepository, times(1)).findRelevantNotices(1L);
    }

    @Test
    void testGetPublicNotices_ShouldReturnOnlyPublicNotices() {
        List<Notice> publicNotices = List.of(testNotice);
        when(noticeRepository.findByScopeAndIsActiveOrderByCreatedAtDesc(NoticeScope.PUBLIC, true))
                .thenReturn(publicNotices);

        List<Notice> result = noticeService.getPublicNotices();

        assertThat(result).isNotNull();
        assertThat(result).hasSize(1);
        verify(noticeRepository, times(1))
                .findByScopeAndIsActiveOrderByCreatedAtDesc(NoticeScope.PUBLIC, true);
    }

    @Test
    void testDeleteNoticeByAuthor_ShouldBeSuccessful() {
        when(noticeRepository.findById(1L)).thenReturn(Optional.of(testNotice));

        noticeService.deleteNotice(1L, teacherUser);

        assertThat(testNotice.isActive()).isFalse();
        verify(noticeRepository, times(1)).findById(1L);
    }

    @Test
    void testDeleteNoticeByAdmin_ShouldBeSuccessful() {
        when(noticeRepository.findById(1L)).thenReturn(Optional.of(testNotice));

        noticeService.deleteNotice(1L, adminUser);

        assertThat(testNotice.isActive()).isFalse();
        verify(noticeRepository, times(1)).findById(1L);
    }

    @Test
    void testDeleteNoticeByUnauthorizedUser_ShouldThrowException() {
        Student unauthorizedUser = new Student();
        unauthorizedUser.setUserId(999L);
        unauthorizedUser.setRole(Role.STUDENT);

        when(noticeRepository.findById(1L)).thenReturn(Optional.of(testNotice));

        assertThatThrownBy(() -> noticeService.deleteNotice(1L, unauthorizedUser))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Unauthorized to delete this notice");

        verify(noticeRepository, times(1)).findById(1L);
    }

    @Test
    void testDeleteNonExistentNotice_ShouldThrowException() {
        when(noticeRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> noticeService.deleteNotice(999L, teacherUser))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Notice not found");

        verify(noticeRepository, times(1)).findById(999L);
    }
}
