package vn.project.ClinicSystem.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.project.ClinicSystem.model.PatientVisit;
import vn.project.ClinicSystem.model.enums.VisitStatus;

@Repository
public interface PatientVisitRepository extends JpaRepository<PatientVisit, Long> {
    List<PatientVisit> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    
    Page<PatientVisit> findByPatientIdOrderByCreatedAtDesc(Long patientId, Pageable pageable);

    List<PatientVisit> findByStatus(VisitStatus status);

    boolean existsByPrimaryAppointmentId(Long primaryAppointmentId);
}
