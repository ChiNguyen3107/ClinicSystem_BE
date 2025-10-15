package vn.project.ClinicSystem.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.project.ClinicSystem.model.AppointmentRequest;
import vn.project.ClinicSystem.model.enums.AppointmentRequestStatus;

@Repository
public interface AppointmentRequestRepository extends JpaRepository<AppointmentRequest, Long> {

    List<AppointmentRequest> findByStatusOrderByCreatedAtAsc(AppointmentRequestStatus status);

    List<AppointmentRequest> findAllByOrderByCreatedAtDesc();

    Optional<AppointmentRequest> findByIdAndStatus(Long id, AppointmentRequestStatus status);
}
