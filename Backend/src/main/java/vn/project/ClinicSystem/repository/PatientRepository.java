package vn.project.ClinicSystem.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.project.ClinicSystem.model.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByCode(String code);

    boolean existsByCodeIgnoreCase(String code);

    List<Patient> findByFullNameContainingIgnoreCase(String keyword);

    @Query("""
                SELECT p
                FROM Patient p
                WHERE (:keyword IS NULL OR LOWER(p.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')))
                  AND (:dateOfBirth IS NULL OR p.dateOfBirth = :dateOfBirth)
                  AND (:phone IS NULL OR p.phone = :phone)
            """)
    List<Patient> searchPatients(@Param("keyword") String keyword,
            @Param("dateOfBirth") LocalDate dateOfBirth,
            @Param("phone") String phone);

}
