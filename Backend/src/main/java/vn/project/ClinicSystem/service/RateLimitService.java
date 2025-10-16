package vn.project.ClinicSystem.service;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.project.ClinicSystem.model.User;
import vn.project.ClinicSystem.repository.AuditLogRepository;

@Service
public class RateLimitService {
    
    @Autowired
    private AuditLogRepository auditLogRepository;
    
    // In-memory storage for rate limiting (in production, use Redis)
    private final ConcurrentHashMap<String, RateLimitInfo> loginAttempts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, RateLimitInfo> apiCalls = new ConcurrentHashMap<>();
    
    // Rate limit configurations
    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final Duration LOGIN_ATTEMPT_WINDOW = Duration.ofMinutes(15);
    private static final int MAX_API_CALLS_PER_MINUTE = 100;
    private static final Duration API_CALL_WINDOW = Duration.ofMinutes(1);
    
    public boolean isLoginAllowed(String email, String ipAddress) {
        String key = email + ":" + ipAddress;
        RateLimitInfo info = loginAttempts.get(key);
        
        if (info == null) {
            info = new RateLimitInfo();
            loginAttempts.put(key, info);
        }
        
        // Clean up expired attempts
        if (info.lastAttempt != null && 
            Duration.between(info.lastAttempt, Instant.now()).compareTo(LOGIN_ATTEMPT_WINDOW) > 0) {
            info.attempts.set(0);
        }
        
        return info.attempts.get() < MAX_LOGIN_ATTEMPTS;
    }
    
    public void recordLoginAttempt(String email, String ipAddress, boolean success) {
        String key = email + ":" + ipAddress;
        RateLimitInfo info = loginAttempts.get(key);
        
        if (info == null) {
            info = new RateLimitInfo();
            loginAttempts.put(key, info);
        }
        
        if (!success) {
            info.attempts.incrementAndGet();
            info.lastAttempt = Instant.now();
            
            // Log failed attempt
            logSecurityEvent("LOGIN_ATTEMPT_FAILED", 
                "Email: " + email + ", IP: " + ipAddress + ", Attempts: " + info.attempts.get());
            
            // If max attempts reached, log security alert
            if (info.attempts.get() >= MAX_LOGIN_ATTEMPTS) {
                logSecurityEvent("LOGIN_BLOCKED", 
                    "Email: " + email + ", IP: " + ipAddress + " - Max attempts exceeded");
            }
        } else {
            // Reset attempts on successful login
            info.attempts.set(0);
            info.lastAttempt = null;
        }
    }
    
    public boolean isApiCallAllowed(String identifier) {
        RateLimitInfo info = apiCalls.get(identifier);
        
        if (info == null) {
            info = new RateLimitInfo();
            apiCalls.put(identifier, info);
        }
        
        // Clean up expired calls
        if (info.lastAttempt != null && 
            Duration.between(info.lastAttempt, Instant.now()).compareTo(API_CALL_WINDOW) > 0) {
            info.attempts.set(0);
        }
        
        boolean allowed = info.attempts.get() < MAX_API_CALLS_PER_MINUTE;
        
        if (allowed) {
            info.attempts.incrementAndGet();
            info.lastAttempt = Instant.now();
        } else {
            logSecurityEvent("API_RATE_LIMIT_EXCEEDED", 
                "Identifier: " + identifier + ", Calls: " + info.attempts.get());
        }
        
        return allowed;
    }
    
    public void blockUser(String email, String reason) {
        // In production, this would update user status in database
        logSecurityEvent("USER_BLOCKED", "Email: " + email + ", Reason: " + reason);
    }
    
    public void unblockUser(String email) {
        // In production, this would update user status in database
        logSecurityEvent("USER_UNBLOCKED", "Email: " + email);
    }
    
    private void logSecurityEvent(String action, String details) {
        // This would be implemented to log to audit system
        System.out.println("Security Event: " + action + " - " + details);
    }
    
    private static class RateLimitInfo {
        private final AtomicInteger attempts = new AtomicInteger(0);
        private Instant lastAttempt;
    }
}
