package com.scholr.scholr.scheduler;

import com.scholr.scholr.service.OTPService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class OTPCleanupScheduler {

    private final OTPService otpService;

    // Every hour
    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void cleanupExpiredOTPs() {
        log.info("[Scheduler] Starting cleanup of expired OTPs from DB...");

        int deletedCount = otpService.deleteExpiredTokens(LocalDateTime.now());

        log.info("[Scheduler] OTP Cleanup finished. Deleted {} rows.", deletedCount);
    }
}