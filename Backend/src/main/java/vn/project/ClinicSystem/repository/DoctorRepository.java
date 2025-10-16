package vn.project.ClinicSystem.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.project.ClinicSystem.model.Doctor;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByAccountId(Long accountId);

    List<Doctor> findBySpecialtyContainingIgnoreCase(String specialty);
    
    Page<Doctor> findBySpecialtyContainingIgnoreCase(String specialty, Pageable pageable);

    Optional<Doctor> findByLicenseNumberIgnoreCase(String licenseNumber);

    boolean existsByLicenseNumberIgnoreCase(String licenseNumber);
}