package vn.project.ClinicSystem.repository;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.project.ClinicSystem.model.DoctorSchedule;

@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, Long> {

    List<DoctorSchedule> findByDoctorId(Long doctorId);

    @Query("SELECT ds FROM DoctorSchedule ds JOIN ds.daysOfWeek day " +
            "WHERE ds.doctor.id = :doctorId " +
            "AND day = :dayOfWeek " +
            "AND ds.startTime <= :time AND ds.endTime > :time") // endTime > time để đảm bảo ca làm việc vẫn hợp lệ
    List<DoctorSchedule> findSchedulesForDoctorAt(
            @Param("doctorId") Long doctorId,
            @Param("dayOfWeek") DayOfWeek dayOfWeek,
            @Param("time") LocalTime time);
}