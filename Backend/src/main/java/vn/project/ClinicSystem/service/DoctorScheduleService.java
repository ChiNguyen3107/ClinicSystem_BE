package vn.project.ClinicSystem.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;
import vn.project.ClinicSystem.model.ClinicRoom;
import vn.project.ClinicSystem.model.Doctor;
import vn.project.ClinicSystem.model.DoctorSchedule;
import vn.project.ClinicSystem.repository.ClinicRoomRepository;
import vn.project.ClinicSystem.repository.DoctorRepository;
import vn.project.ClinicSystem.repository.DoctorScheduleRepository;

@Service
@Transactional
public class DoctorScheduleService {

    private final DoctorScheduleRepository scheduleRepository;
    private final DoctorRepository doctorRepository;
    private final ClinicRoomRepository clinicRoomRepository;

    public DoctorScheduleService(DoctorScheduleRepository scheduleRepository, DoctorRepository doctorRepository,
            ClinicRoomRepository clinicRoomRepository) {
        this.scheduleRepository = scheduleRepository;
        this.doctorRepository = doctorRepository;
        this.clinicRoomRepository = clinicRoomRepository;
    }

    public List<DoctorSchedule> getSchedulesForDoctor(Long doctorId) {
        return scheduleRepository.findByDoctorId(doctorId);
    }

    public DoctorSchedule createSchedule(Long doctorId, Long clinicRoomId, DoctorSchedule schedule) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bác sĩ với id: " + doctorId));
        ClinicRoom clinicRoom = clinicRoomRepository.findById(clinicRoomId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phòng khám với id: " + clinicRoomId));

        schedule.setDoctor(doctor);
        schedule.setClinicRoom(clinicRoom);

        if (schedule.getStartTime().isAfter(schedule.getEndTime())
                || schedule.getStartTime().equals(schedule.getEndTime())) {
            throw new IllegalArgumentException("Thời gian bắt đầu phải trước thời gian kết thúc.");
        }
        return scheduleRepository.save(schedule);
    }

    public void deleteSchedule(Long scheduleId) {
        if (!scheduleRepository.existsById(scheduleId)) {
            throw new EntityNotFoundException("Không tìm thấy lịch làm việc với id: " + scheduleId);
        }
        scheduleRepository.deleteById(scheduleId);
    }
}