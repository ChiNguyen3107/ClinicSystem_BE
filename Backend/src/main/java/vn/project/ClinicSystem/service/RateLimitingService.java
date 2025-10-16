package vn.project.ClinicSystem.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.project.ClinicSystem.config.RateLimitingInterceptor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service để quản lý rate limiting
 */
@Service
public class RateLimitingService {
    private static final Logger logger = LoggerFactory.getLogger(RateLimitingService.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
    
    @Autowired
    private RateLimitingInterceptor rateLimitingInterceptor;
    
    // Track statistics
    private final Map<String, Integer> requestCounts = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> lastRequestTimes = new ConcurrentHashMap<>();
    
    /**
     * Get rate limiting statistics for an IP
     */
    public Map<String, Object> getStatistics(String clientIP) {
        int requestCount = requestCounts.getOrDefault(clientIP, 0);
        LocalDateTime lastRequest = lastRequestTimes.get(clientIP);
        
        return Map.of(
            "clientIP", clientIP,
            "requestCount", requestCount,
            "lastRequest", lastRequest != null ? lastRequest.format(formatter) : "Never",
            "timestamp", LocalDateTime.now().format(formatter)
        );
    }
    
    /**
     * Reset statistics for an IP
     */
    public void resetStatistics(String clientIP) {
        requestCounts.remove(clientIP);
        lastRequestTimes.remove(clientIP);
        logger.info("Reset statistics for IP: {}", clientIP);
    }
    
    /**
     * Get all blocked IPs
     */
    public Map<String, Object> getBlockedIPs() {
        return Map.of(
            "blockedIPs", rateLimitingInterceptor.getBlockedIPs(),
            "timestamp", LocalDateTime.now().format(formatter)
        );
    }
    
    /**
     * Unblock an IP
     */
    public void unblockIP(String clientIP) {
        rateLimitingInterceptor.unblockIP(clientIP);
        resetStatistics(clientIP);
        logger.info("Unblocked IP: {}", clientIP);
    }
}
