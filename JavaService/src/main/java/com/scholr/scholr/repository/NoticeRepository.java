package com.scholr.scholr.repository;

import com.scholr.scholr.entity.Notice;
import com.scholr.scholr.enums.NoticeScope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    List<Notice> findByScopeAndIsActiveOrderByCreatedAtDesc(NoticeScope scope, boolean isActive);

    @Query("SELECT n FROM Notice n WHERE n.isActive = true AND " +
            "(n.scope = 'PUBLIC' OR (n.department.id = :deptId OR n.department IS NULL)) " +
            "ORDER BY n.createdAt DESC")
    List<Notice> findRelevantNotices(Long deptId);
}