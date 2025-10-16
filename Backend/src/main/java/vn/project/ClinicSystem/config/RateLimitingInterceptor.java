package vn.project.ClinicSystem.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

/**
 * Interceptor để thực hiện rate limiting
 */
@Component
public class RateLimitingInterceptor implements HandlerInterceptor {
    private static final Logger logger = LoggerFactory.getLogger(RateLimitingInterceptor.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
    
    // Track blocked IPs
    private final Map<String, LocalDateTime> blockedIPs = new ConcurrentHashMap<>();
    private final Map<String, Integer> requestCounts = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> lastRequestTimes = new ConcurrentHashMap<>();
    
    // Rate limiting configuration
    private static final int MAX_REQUESTS_PER_MINUTE = 100;
    private static final int MAX_REQUESTS_BEFORE_BLOCK = 200;
    private static final int BLOCK_DURATION_HOURS = 1;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String clientIP = getClientIP(request);
        
        // Check if IP is blocked
        if (isIPBlocked(clientIP)) {
            logger.warn("Blocked IP {} attempted to access {}", clientIP, request.getRequestURI());
            sendRateLimitExceededResponse(response, "IP đã bị chặn do quá nhiều request");
            return false;
        }
        
        // Check rate limit
        if (isRateLimitExceeded(clientIP)) {
            logger.warn("Rate limit exceeded for IP: {}", clientIP);
            sendRateLimitExceededResponse(response, "Quá nhiều request. Vui lòng thử lại sau 1 phút");
            return false;
        }
        
        // Update request count
        updateRequestCount(clientIP);
        
        return true;
    }
    
    private boolean isIPBlocked(String clientIP) {
        LocalDateTime blockTime = blockedIPs.get(clientIP);
        if (blockTime == null) {
            return false;
        }
        
        // Unblock after specified duration
        if (LocalDateTime.now().isAfter(blockTime.plusHours(BLOCK_DURATION_HOURS))) {
            blockedIPs.remove(clientIP);
            requestCounts.remove(clientIP);
            lastRequestTimes.remove(clientIP);
            logger.info("IP {} unblocked after timeout", clientIP);
            return false;
        }
        
        return true;
    }
    
    private boolean isRateLimitExceeded(String clientIP) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastRequest = lastRequestTimes.get(clientIP);
        
        // If no previous request or more than 1 minute ago, reset count
        if (lastRequest == null || now.isAfter(lastRequest.plusMinutes(1))) {
            requestCounts.put(clientIP, 1);
            lastRequestTimes.put(clientIP, now);
            return false;
        }
        
        // Check if within rate limit
        int currentCount = requestCounts.getOrDefault(clientIP, 0);
        return currentCount >= MAX_REQUESTS_PER_MINUTE;
    }
    
    private void updateRequestCount(String clientIP) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastRequest = lastRequestTimes.get(clientIP);
        
        if (lastRequest == null || now.isAfter(lastRequest.plusMinutes(1))) {
            // Reset count if more than 1 minute ago
            requestCounts.put(clientIP, 1);
        } else {
            // Increment count
            int newCount = requestCounts.merge(clientIP, 1, Integer::sum);
            
            // Block IP if too many requests
            if (newCount > MAX_REQUESTS_BEFORE_BLOCK) {
                blockIP(clientIP);
                logger.error("IP {} blocked due to excessive requests: {}", clientIP, newCount);
            }
        }
        
        lastRequestTimes.put(clientIP, now);
    }
    
    private void blockIP(String clientIP) {
        blockedIPs.put(clientIP, LocalDateTime.now());
        logger.error("IP {} blocked at {}", clientIP, LocalDateTime.now().format(formatter));
    }
    
    public Map<String, LocalDateTime> getBlockedIPs() {
        return new ConcurrentHashMap<>(blockedIPs);
    }
    
    public void unblockIP(String clientIP) {
        blockedIPs.remove(clientIP);
        requestCounts.remove(clientIP);
        lastRequestTimes.remove(clientIP);
        logger.info("IP {} unblocked manually", clientIP);
    }
    
    private void sendRateLimitExceededResponse(HttpServletResponse response, String message) {
        try {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json;charset=UTF-8");
            response.setHeader("Retry-After", "60"); // Retry after 60 seconds
            
            String jsonResponse = String.format(
                "{\"statusCode\":429,\"error\":\"RATE_LIMIT_EXCEEDED\",\"message\":\"%s\",\"timestamp\":\"%s\"}",
                message,
                LocalDateTime.now().format(formatter)
            );
            
            response.getWriter().write(jsonResponse);
            response.getWriter().flush();
        } catch (IOException e) {
            logger.error("Error sending rate limit response", e);
        }
    }
    
    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIP = request.getHeader("X-Real-IP");
        if (xRealIP != null && !xRealIP.isEmpty()) {
            return xRealIP;
        }
        
        return request.getRemoteAddr();
    }
}
