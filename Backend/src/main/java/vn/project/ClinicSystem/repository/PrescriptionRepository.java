package vn.project.ClinicSystem.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.project.ClinicSystem.model.Prescription;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    List<Prescription> findByVisitIdOrderByIssuedAtDesc(Long visitId);
    
    Page<Prescription> findByVisitIdOrderByIssuedAtDesc(Long visitId, Pageable pageable);
}
