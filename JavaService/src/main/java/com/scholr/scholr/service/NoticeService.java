package com.scholr.scholr.service;

import com.scholr.scholr.dto.NoticeRequest;
import com.scholr.scholr.entity.Notice;
import com.scholr.scholr.entity.User;
import jakarta.transaction.Transactional;

import java.util.List;

public interface NoticeService {
    @Transactional
    Notice createNotice(NoticeRequest dto, User author);

    List<Notice> getNoticesForUser(User user);

    List<Notice> getPublicNotices();

    @Transactional
    void deleteNotice(Long id, User user);
}
