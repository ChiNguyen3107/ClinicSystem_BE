package vn.project.ClinicSystem.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Interceptor để log request/response và performance metrics
 */
@Component
public class LoggingInterceptor implements HandlerInterceptor {
    private static final Logger logger = LoggerFactory.getLogger(LoggingInterceptor.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        long startTime = System.currentTimeMillis();
        request.setAttribute("startTime", startTime);
        
        String clientIP = getClientIP(request);
        String userAgent = request.getHeader("User-Agent");
        
        logger.info("=== REQUEST START ===");
        logger.info("Timestamp: {}", LocalDateTime.now().format(formatter));
        logger.info("Method: {}", request.getMethod());
        logger.info("URI: {}", request.getRequestURI());
        logger.info("Query String: {}", request.getQueryString());
        logger.info("Client IP: {}", clientIP);
        logger.info("User-Agent: {}", userAgent);
        logger.info("Content-Type: {}", request.getContentType());
        logger.info("Content-Length: {}", request.getContentLength());
        
        // Log request headers (excluding sensitive ones)
        request.getHeaderNames().asIterator().forEachRemaining(headerName -> {
            if (!isSensitiveHeader(headerName)) {
                logger.debug("Header {}: {}", headerName, request.getHeader(headerName));
            }
        });
        
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        long startTime = (Long) request.getAttribute("startTime");
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        
        String clientIP = getClientIP(request);
        
        logger.info("=== REQUEST END ===");
        logger.info("Timestamp: {}", LocalDateTime.now().format(formatter));
        logger.info("Method: {}", request.getMethod());
        logger.info("URI: {}", request.getRequestURI());
        logger.info("Status: {}", response.getStatus());
        logger.info("Client IP: {}", clientIP);
        logger.info("Duration: {} ms", duration);
        
        if (ex != null) {
            logger.error("Exception occurred during request processing: {}", ex.getMessage(), ex);
        }
        
        // Log performance metrics
        if (duration > 1000) {
            logger.warn("SLOW REQUEST: {} ms for {} {}", duration, request.getMethod(), request.getRequestURI());
        }
        
        // Log response headers
        response.getHeaderNames().forEach(headerName -> {
            logger.debug("Response Header {}: {}", headerName, response.getHeader(headerName));
        });
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

    private boolean isSensitiveHeader(String headerName) {
        String lowerHeaderName = headerName.toLowerCase();
        return lowerHeaderName.contains("authorization") || 
               lowerHeaderName.contains("cookie") || 
               lowerHeaderName.contains("password") ||
               lowerHeaderName.contains("token");
    }
}
