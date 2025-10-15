package vn.project.ClinicSystem.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.project.ClinicSystem.model.Appointment;
import vn.project.ClinicSystem.model.enums.AppointmentStatus;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

        List<Appointment> findByDoctorIdOrderByScheduledAtAsc(Long doctorId);

        List<Appointment> findByPatientIdOrderByScheduledAtDesc(Long patientId);

        List<Appointment> findByStatus(AppointmentStatus status);

        @Query(value = """
                        SELECT EXISTS (
                                SELECT 1
                                FROM appointments a
                                WHERE a.status <> 'CANCELLED'
                                  AND a.doctor_id = :doctorId
                                  AND (:ignoreAppointmentId IS NULL OR a.id <> :ignoreAppointmentId)
                                  AND a.scheduled_at < :endAt
                                  AND DATE_ADD(a.scheduled_at, INTERVAL a.duration MINUTE) > :startAt
                        )
                        """, nativeQuery = true)
        int existsDoctorOverlap(@Param("doctorId") Long doctorId,
                        @Param("startAt") LocalDateTime startAt,
                        @Param("endAt") LocalDateTime endAt,
                        @Param("ignoreAppointmentId") Long ignoreAppointmentId);

        @Query(value = """
                        SELECT EXISTS (
                                SELECT 1
                                FROM appointments a
                                WHERE a.status <> 'CANCELLED'
                                  AND a.clinic_room_id = :clinicRoomId
                                  AND (:ignoreAppointmentId IS NULL OR a.id <> :ignoreAppointmentId)
                                  AND a.scheduled_at < :endAt
                                  AND DATE_ADD(a.scheduled_at, INTERVAL a.duration MINUTE) > :startAt
                        )
                        """, nativeQuery = true)
        int existsClinicRoomOverlap(@Param("clinicRoomId") Long clinicRoomId,
                        @Param("startAt") LocalDateTime startAt,
                        @Param("endAt") LocalDateTime endAt,
                        @Param("ignoreAppointmentId") Long ignoreAppointmentId);

}
