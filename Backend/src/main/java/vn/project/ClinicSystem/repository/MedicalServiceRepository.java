package vn.project.ClinicSystem.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.project.ClinicSystem.model.MedicalService;

@Repository
public interface MedicalServiceRepository extends JpaRepository<MedicalService, Long> {
    Optional<MedicalService> findByCode(String code);

    boolean existsByCodeIgnoreCase(String code);

    List<MedicalService> findByClinicRoomId(Long clinicRoomId);
    
    Page<MedicalService> findByClinicRoomId(Long clinicRoomId, Pageable pageable);
    
    // Dashboard methods
    List<MedicalService> findTop5ByOrderByUsageCountDesc();
}
