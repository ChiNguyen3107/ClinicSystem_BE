package vn.project.ClinicSystem.interceptor;

import java.time.Duration;
import java.time.Instant;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class PerformanceInterceptor implements HandlerInterceptor {

    private static final String START_TIME_ATTRIBUTE = "startTime";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        request.setAttribute(START_TIME_ATTRIBUTE, Instant.now());
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        Instant startTime = (Instant) request.getAttribute(START_TIME_ATTRIBUTE);
        if (startTime != null) {
            Duration duration = Duration.between(startTime, Instant.now());
            long responseTime = duration.toMillis();
            
            String method = request.getMethod();
            String uri = request.getRequestURI();
            int status = response.getStatus();
            
            log.info("API Performance - {} {} - Status: {} - Response Time: {}ms", 
                    method, uri, status, responseTime);
            
            // Log slow requests (> 1 second)
            if (responseTime > 1000) {
                log.warn("SLOW REQUEST DETECTED - {} {} - Response Time: {}ms", 
                        method, uri, responseTime);
            }
        }
    }
}
