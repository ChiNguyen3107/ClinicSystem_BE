package vn.project.ClinicSystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import vn.project.ClinicSystem.service.RateLimitingService;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * Controller để test và quản lý rate limiting
 */
@RestController
@RequestMapping("/api/rate-limiting")
public class RateLimitingController {
    
    @Autowired
    private RateLimitingService rateLimitingService;
    
    /**
     * Test endpoint để kiểm tra rate limiting
     */
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testRateLimit(HttpServletRequest request) {
        String clientIP = getClientIP(request);
        
        Map<String, Object> response = Map.of(
            "message", "Rate limiting test successful",
            "clientIP", clientIP,
            "timestamp", java.time.LocalDateTime.now().toString()
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get rate limiting statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(HttpServletRequest request) {
        String clientIP = getClientIP(request);
        return ResponseEntity.ok(rateLimitingService.getStatistics(clientIP));
    }
    
    /**
     * Reset statistics for current IP
     */
    @PostMapping("/reset")
    public ResponseEntity<Map<String, Object>> resetStats(HttpServletRequest request) {
        String clientIP = getClientIP(request);
        rateLimitingService.resetStatistics(clientIP);
        
        Map<String, Object> response = Map.of(
            "message", "Statistics reset successfully",
            "clientIP", clientIP,
            "timestamp", java.time.LocalDateTime.now().toString()
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get all blocked IPs (admin only)
     */
    @GetMapping("/blocked")
    public ResponseEntity<Map<String, Object>> getBlockedIPs() {
        return ResponseEntity.ok(rateLimitingService.getBlockedIPs());
    }
    
    /**
     * Unblock an IP (admin only)
     */
    @PostMapping("/unblock/{clientIP}")
    public ResponseEntity<Map<String, Object>> unblockIP(@PathVariable String clientIP) {
        rateLimitingService.unblockIP(clientIP);
        
        Map<String, Object> response = Map.of(
            "message", "IP unblocked successfully",
            "clientIP", clientIP,
            "timestamp", java.time.LocalDateTime.now().toString()
        );
        
        return ResponseEntity.ok(response);
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
