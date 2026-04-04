package com.scholr.scholr.scheduler;


import com.scholr.scholr.service.BlackListTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class BlackListTokenCleanupScheduler {

    private final BlackListTokenService service;

    // Scheduled to run every day at 2:00 AM UTC (7:30 AM IST)
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void cleanupExpiredTokens() {
        log.info("Starting cleanup of expired blacklisted tokens...");

        LocalDateTime now = LocalDateTime.now();
        int deletedCount = service.deleteByExpirationTimeBefore(now);

        log.info("Cleanup finished. Deleted {} expired tokens.", deletedCount);
    }
}