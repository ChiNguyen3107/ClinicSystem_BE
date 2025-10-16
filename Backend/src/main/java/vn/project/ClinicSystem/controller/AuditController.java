package vn.project.ClinicSystem.controller;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vn.project.ClinicSystem.model.AuditLog;
import vn.project.ClinicSystem.model.User;
import vn.project.ClinicSystem.repository.AuditLogRepository;
import vn.project.ClinicSystem.repository.UserRepository;

@RestController
@RequestMapping("/audit")
@PreAuthorize("hasRole('ADMIN')")
public class AuditController {
    
    @Autowired
    private AuditLogRepository auditLogRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/logs")
    public ResponseEntity<Page<AuditLog>> getAuditLogs(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String resource,
            @RequestParam(required = false) String ipAddress,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            Pageable pageable) {
        
        Page<AuditLog> logs;
        
        if (userId != null) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                logs = auditLogRepository.findByUserOrderByCreatedAtDesc(user, pageable);
            } else {
                logs = Page.empty();
            }
        } else if (action != null) {
            List<AuditLog> actionLogs = auditLogRepository.findByActionOrderByCreatedAtDesc(action);
            logs = Page.empty();
        } else if (resource != null) {
            List<AuditLog> resourceLogs = auditLogRepository.findByResourceAndResourceIdOrderByCreatedAtDesc(resource, null);
            logs = Page.empty();
        } else if (ipAddress != null) {
            List<AuditLog> ipLogs = auditLogRepository.findByIpAddress(ipAddress);
            logs = Page.empty();
        } else if (startDate != null && endDate != null) {
            Instant start = Instant.parse(startDate);
            Instant end = Instant.parse(endDate);
            List<AuditLog> dateLogs = auditLogRepository.findByDateRange(start, end);
            logs = Page.empty();
        } else {
            logs = auditLogRepository.findAll(pageable);
        }
        
        return ResponseEntity.ok(logs);
    }
    
    @GetMapping("/security-events")
    public ResponseEntity<List<AuditLog>> getSecurityEvents(
            @RequestParam(required = false) String ipAddress,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        List<AuditLog> events;
        
        if (ipAddress != null) {
            events = auditLogRepository.findByIpAddress(ipAddress);
        } else if (startDate != null && endDate != null) {
            Instant start = Instant.parse(startDate);
            Instant end = Instant.parse(endDate);
            events = auditLogRepository.findByDateRange(start, end);
        } else {
            events = auditLogRepository.findByActionOrderByCreatedAtDesc("SECURITY_");
        }
        
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/user-activity/{userId}")
    public ResponseEntity<List<AuditLog>> getUserActivity(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        List<AuditLog> activities = auditLogRepository.findByUserOrderByCreatedAtDesc(user);
        return ResponseEntity.ok(activities);
    }
}
