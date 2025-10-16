package vn.project.ClinicSystem.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.project.ClinicSystem.model.AuditLog;
import vn.project.ClinicSystem.model.User;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    
    List<AuditLog> findByUserOrderByCreatedAtDesc(User user);
    
    Page<AuditLog> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    List<AuditLog> findByActionOrderByCreatedAtDesc(String action);
    
    List<AuditLog> findByResourceAndResourceIdOrderByCreatedAtDesc(String resource, String resourceId);
    
    @Query("SELECT al FROM AuditLog al WHERE al.createdAt BETWEEN :startDate AND :endDate ORDER BY al.createdAt DESC")
    List<AuditLog> findByDateRange(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);
    
    @Query("SELECT al FROM AuditLog al WHERE al.user = :user AND al.createdAt BETWEEN :startDate AND :endDate ORDER BY al.createdAt DESC")
    List<AuditLog> findByUserAndDateRange(@Param("user") User user, @Param("startDate") Instant startDate, @Param("endDate") Instant endDate);
    
    @Query("SELECT al FROM AuditLog al WHERE al.ipAddress = :ipAddress ORDER BY al.createdAt DESC")
    List<AuditLog> findByIpAddress(@Param("ipAddress") String ipAddress);
}
