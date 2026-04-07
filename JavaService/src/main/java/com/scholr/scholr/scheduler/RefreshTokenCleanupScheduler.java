package com.scholr.scholr.scheduler;

import com.scholr.scholr.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenCleanupScheduler {

    private final RefreshTokenService refreshTokenService;

    @Scheduled(cron = "0 30 2 * * *")
    @Transactional
    public void cleanupExpiredRefreshTokens() {
        log.info("[Scheduler] Starting cleanup of expired Refresh Tokens...");

        int deletedCount = refreshTokenService.deleteExpiredTokens(LocalDateTime.now());

        log.info("[Scheduler] Refresh Token Cleanup finished. Deleted {} rows.", deletedCount);
    }
}