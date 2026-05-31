package com.scholr.scholr.scheduler;

import com.scholr.scholr.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@Slf4j
@RequiredArgsConstructor
public class NoticeCleanupScheduler {

    private final NoticeRepository noticeRepository;

    @Scheduled(cron = "0 0 0 1 * ?")
    @Transactional
    public void executeMonthlyNoticeCleanup() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);

        log.info("[Automation:Scheduler] Starting monthly stale notices retention pipeline...");

        int deletedCount = noticeRepository.expireOldNotices(cutoffDate);

        if (deletedCount > 0) {
            log.info("[Automation:Scheduler] Cleanup successful! Soft-deleted {} notices older than 30 days.", deletedCount);
        } else {
            log.info("[Automation:Scheduler] Cleanup complete. No stale notices found to expire.");
        }
    }
}
