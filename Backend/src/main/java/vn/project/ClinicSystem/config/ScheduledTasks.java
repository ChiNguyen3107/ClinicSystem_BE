package vn.project.ClinicSystem.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import vn.project.ClinicSystem.service.PasswordResetService;
import vn.project.ClinicSystem.service.RefreshTokenService;

@Component
public class ScheduledTasks {
    
    @Autowired
    private RefreshTokenService refreshTokenService;
    
    @Autowired
    private PasswordResetService passwordResetService;
    
    // Clean up expired refresh tokens every hour
    @Scheduled(fixedRate = 3600000) // 1 hour
    public void cleanupExpiredRefreshTokens() {
        refreshTokenService.deleteExpiredTokens();
    }
    
    // Clean up expired password reset tokens every 30 minutes
    @Scheduled(fixedRate = 1800000) // 30 minutes
    public void cleanupExpiredPasswordResetTokens() {
        passwordResetService.deleteExpiredTokens();
    }
}
