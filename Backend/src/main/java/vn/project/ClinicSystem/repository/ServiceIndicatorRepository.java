package vn.project.ClinicSystem.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.project.ClinicSystem.model.ServiceIndicator;

@Repository
public interface ServiceIndicatorRepository extends JpaRepository<ServiceIndicator, Long> {

    List<ServiceIndicator> findByMedicalServiceIdOrderByNameAsc(Long medicalServiceId);

    Optional<ServiceIndicator> findByMedicalServiceIdAndCodeIgnoreCase(Long medicalServiceId, String code);

    List<ServiceIndicator> findByMedicalServiceIdAndRequiredTrue(Long medicalServiceId);
}
