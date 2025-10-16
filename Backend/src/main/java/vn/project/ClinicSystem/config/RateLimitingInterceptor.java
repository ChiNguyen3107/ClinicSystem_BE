package vn.project.ClinicSystem.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vn.project.ClinicSystem.service.RateLimitService;

@Component
public class RateLimitingInterceptor implements HandlerInterceptor {
    
    @Autowired
    private RateLimitService rateLimitService;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        
        // Skip rate limiting for certain endpoints
        if (shouldSkipRateLimiting(requestURI, method)) {
            return true;
        }
        
        // Get client identifier (IP address or user ID if authenticated)
        String identifier = getClientIdentifier(request);
        
        // Check if API call is allowed
        if (!rateLimitService.isApiCallAllowed(identifier)) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Quá nhiều yêu cầu. Vui lòng thử lại sau.\"}");
            return false;
        }
        
        return true;
    }
    
    private boolean shouldSkipRateLimiting(String requestURI, String method) {
        // Skip rate limiting for health checks and public endpoints
        return requestURI.startsWith("/actuator/") ||
               requestURI.equals("/") ||
               (requestURI.startsWith("/auth/") && method.equals("POST"));
    }
    
    private String getClientIdentifier(HttpServletRequest request) {
        // Try to get user ID from security context if authenticated
        // For now, use IP address as identifier
        return getClientIpAddress(request);
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}