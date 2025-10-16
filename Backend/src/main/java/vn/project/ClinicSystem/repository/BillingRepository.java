package vn.project.ClinicSystem.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.project.ClinicSystem.model.Billing;

@Repository
public interface BillingRepository extends JpaRepository<Billing, Long> {

    Optional<Billing> findByVisitId(Long visitId);

    List<Billing> findByPatientIdOrderByIssuedAtDesc(Long patientId);
    
    Page<Billing> findByPatientIdOrderByIssuedAtDesc(Long patientId, Pageable pageable);
    
    Page<Billing> findByVisitId(Long visitId, Pageable pageable);
    
    // Dashboard methods
    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Billing b WHERE b.issuedAt BETWEEN :startDate AND :endDate")
    Double calculateRevenueByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
