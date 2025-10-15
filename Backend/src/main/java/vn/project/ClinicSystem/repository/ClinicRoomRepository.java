package vn.project.ClinicSystem.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.project.ClinicSystem.model.ClinicRoom;

@Repository
public interface ClinicRoomRepository extends JpaRepository<ClinicRoom, Long> {
    Optional<ClinicRoom> findByCode(String code);

    boolean existsByCodeIgnoreCase(String code);

    List<ClinicRoom> findByFloorIgnoreCase(String floor);
}
