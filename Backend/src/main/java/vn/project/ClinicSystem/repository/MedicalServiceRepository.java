package vn.project.ClinicSystem.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.project.ClinicSystem.model.MedicalService;

@Repository
public interface MedicalServiceRepository extends JpaRepository<MedicalService, Long> {
    Optional<MedicalService> findByCode(String code);

    boolean existsByCodeIgnoreCase(String code);

    List<MedicalService> findByClinicRoomId(Long clinicRoomId);
}
