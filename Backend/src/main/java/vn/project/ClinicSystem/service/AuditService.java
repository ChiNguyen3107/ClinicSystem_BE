package vn.project.ClinicSystem.service;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import vn.project.ClinicSystem.model.AuditLog;
import vn.project.ClinicSystem.model.User;
import vn.project.ClinicSystem.repository.AuditLogRepository;

@Service
public class AuditService {
    
    @Autowired
    private AuditLogRepository auditLogRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    public void logAction(User user, String action, String resource, String resourceId, 
                         Object oldValues, Object newValues, HttpServletRequest request) {
        try {
            AuditLog auditLog = new AuditLog();
            auditLog.setUser(user);
            auditLog.setAction(action);
            auditLog.setResource(resource);
            auditLog.setResourceId(resourceId);
            
            if (oldValues != null) {
                auditLog.setOldValues(objectMapper.writeValueAsString(oldValues));
            }
            
            if (newValues != null) {
                auditLog.setNewValues(objectMapper.writeValueAsString(newValues));
            }
            
            if (request != null) {
                auditLog.setIpAddress(getClientIpAddress(request));
                auditLog.setUserAgent(request.getHeader("User-Agent"));
                auditLog.setSessionId(request.getSession().getId());
            }
            
            auditLog.setCreatedAt(Instant.now());
            auditLog.setUpdatedAt(Instant.now());
            
            auditLogRepository.save(auditLog);
        } catch (JsonProcessingException e) {
            // Log error but don't fail the main operation
            System.err.println("Failed to serialize audit log data: " + e.getMessage());
        }
    }
    
    public void logSecurityEvent(User user, String action, String details, HttpServletRequest request) {
        AuditLog auditLog = new AuditLog();
        auditLog.setUser(user);
        auditLog.setAction("SECURITY_" + action);
        auditLog.setResource("SECURITY");
        auditLog.setDetails(details);
        
        if (request != null) {
            auditLog.setIpAddress(getClientIpAddress(request));
            auditLog.setUserAgent(request.getHeader("User-Agent"));
            auditLog.setSessionId(request.getSession().getId());
        }
        
        auditLog.setCreatedAt(Instant.now());
        auditLog.setUpdatedAt(Instant.now());
        
        auditLogRepository.save(auditLog);
    }
    
    public void logLoginAttempt(String email, boolean success, String details, HttpServletRequest request) {
        AuditLog auditLog = new AuditLog();
        auditLog.setAction(success ? "LOGIN_SUCCESS" : "LOGIN_FAILED");
        auditLog.setResource("AUTH");
        auditLog.setDetails("Email: " + email + ", " + details);
        
        if (request != null) {
            auditLog.setIpAddress(getClientIpAddress(request));
            auditLog.setUserAgent(request.getHeader("User-Agent"));
            auditLog.setSessionId(request.getSession().getId());
        }
        
        auditLog.setCreatedAt(Instant.now());
        auditLog.setUpdatedAt(Instant.now());
        
        auditLogRepository.save(auditLog);
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
