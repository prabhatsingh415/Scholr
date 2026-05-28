package com.scholr.scholr.service;

import com.scholr.scholr.dto.NoticeRequest;
import com.scholr.scholr.entity.Department;
import com.scholr.scholr.entity.Notice;
import com.scholr.scholr.entity.User;
import com.scholr.scholr.enums.NoticeScope;
import com.scholr.scholr.enums.Role;
import com.scholr.scholr.repository.DepartmentRepository;
import com.scholr.scholr.repository.NoticeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class NoticeServiceImpl implements NoticeService {

    private final NoticeRepository noticeRepository;
    private final DepartmentRepository departmentRepository;

    @Transactional
    @Override
    public Notice createNotice(NoticeRequest dto, User author) {
        Notice notice = new Notice();
        notice.setTitle(dto.title());
        notice.setContent(dto.content());
        notice.setContentLink(dto.contentLink());
        notice.setScope(dto.scope());
        notice.setCategory(dto.category());
        notice.setAuthor(author);

        if (author.getRole() == Role.TEACHER) {
            notice.setDepartment(author.getDepartment());
        } else if (author.getRole() == Role.ADMIN) {
            if (dto.deptId() != null) {
                Department dept = departmentRepository.findById(dto.deptId())
                        .orElseThrow(() -> new RuntimeException("Dept not found"));
                notice.setDepartment(dept);
            }
        }

        log.info("Creating notice: {} by {}", notice.getTitle(), author.getCollegeId());
        return noticeRepository.save(notice);
    }

    @Override
    public List<Notice> getNoticesForUser(User user) {
        if (user.getRole() == Role.ADMIN) return noticeRepository.findAll();

        // Student/Teacher gets their dept notices + General/Public ones
        Long deptId = (user.getDepartment() != null) ? user.getDepartment().getId() : null;
        return noticeRepository.findRelevantNotices(deptId);
    }

    @Override
    public List<Notice> getPublicNotices() {
        return noticeRepository.findByScopeAndIsActiveOrderByCreatedAtDesc(NoticeScope.PUBLIC, true);
    }

    @Transactional
    @Override
    public void deleteNotice(Long id, User user) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice not found"));

        // Only Admin or Author can delete
        if (user.getRole() == Role.ADMIN || notice.getAuthor().getUserId().equals(user.getUserId())) {
            notice.setActive(false); // Soft Delete
        } else {
            throw new RuntimeException("Unauthorized to delete this notice");
        }
    }
}
