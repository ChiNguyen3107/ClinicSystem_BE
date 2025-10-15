package vn.project.ClinicSystem.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.project.ClinicSystem.model.MedicationBatch;

@Repository
public interface MedicationBatchRepository extends JpaRepository<MedicationBatch, Long> {

    List<MedicationBatch> findByMedicationIdOrderByExpiryDateAsc(Long medicationId);

    Optional<MedicationBatch> findByMedicationIdAndBatchCode(Long medicationId, String batchCode);
}
