package com.scholr.scholr.service;

import com.scholr.scholr.dto.NoticeRequest;
import com.scholr.scholr.entity.Notice;
import com.scholr.scholr.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface NoticeService {
    @Transactional
    Notice createNotice(NoticeRequest dto, UserDetails userDetails);

    List<Notice> getNoticesForUser(UserDetails userDetails);

    List<Notice> getPublicNotices();

    @Transactional
    void deleteNotice(Long id, UserDetails userDetails);
}
