package vn.project.ClinicSystem.service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import vn.project.ClinicSystem.model.Appointment;
import vn.project.ClinicSystem.model.AppointmentRequest;
import vn.project.ClinicSystem.model.ClinicRoom;
import vn.project.ClinicSystem.model.Doctor;
import vn.project.ClinicSystem.model.DoctorSchedule;
import vn.project.ClinicSystem.model.Patient;
import vn.project.ClinicSystem.model.User;
import vn.project.ClinicSystem.model.dto.AppointmentCreateRequest;
import vn.project.ClinicSystem.model.dto.AppointmentStatusUpdateRequest;
import vn.project.ClinicSystem.model.dto.AppointmentUpdateRequest;
import vn.project.ClinicSystem.model.enums.AppointmentStatus;
import vn.project.ClinicSystem.repository.AppointmentRepository;
import vn.project.ClinicSystem.repository.ClinicRoomRepository;
import vn.project.ClinicSystem.repository.DoctorRepository;
import vn.project.ClinicSystem.repository.DoctorScheduleRepository;
import vn.project.ClinicSystem.repository.PatientRepository;
import vn.project.ClinicSystem.repository.UserRepository;

@Service
@Transactional(readOnly = true)
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final ClinicRoomRepository clinicRoomRepository;
    private final UserRepository userRepository;
    private final DoctorScheduleRepository doctorScheduleRepository;
    private final Validator validator;

    public AppointmentService(AppointmentRepository appointmentRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            ClinicRoomRepository clinicRoomRepository,
            UserRepository userRepository,
            DoctorScheduleRepository doctorScheduleRepository,
            Validator validator) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.clinicRoomRepository = clinicRoomRepository;
        this.userRepository = userRepository;
        this.doctorScheduleRepository = doctorScheduleRepository;
        this.validator = validator;
    }

    public Appointment getById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy lịch khám với id: " + id));
    }

    public List<Appointment> findAll() {
        return appointmentRepository.findAll();
    }

    public List<Appointment> findByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorIdOrderByScheduledAtAsc(doctorId);
    }

    public List<Appointment> findByPatient(Long patientId) {
        return appointmentRepository.findByPatientIdOrderByScheduledAtDesc(patientId);
    }

    public List<Appointment> findByStatus(AppointmentStatus status) {
        return appointmentRepository.findByStatus(status);
    }

    @Transactional
    public Appointment createAppointment(AppointmentCreateRequest request, String createdByUsername) {
        Appointment appointment = new Appointment();
        Patient patient = loadPatient(request.getPatientId());
        Doctor doctor = loadDoctor(request.getDoctorId());
        ClinicRoom clinicRoom = loadClinicRoom(request.getClinicRoomId());

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setClinicRoom(clinicRoom);
        appointment.setScheduledAt(request.getScheduledAt());
        appointment.setDuration(resolveDuration(request.getDuration()));
        appointment.setReason(request.getReason());
        appointment.setNotes(request.getNotes());
        appointment.setStatus(AppointmentStatus.CONFIRMED);

        if (createdByUsername != null) {
            appointment.setCreatedBy(loadUserByUsername(createdByUsername));
        }

        validateBean(appointment);
        ensureAvailability(appointment, null);
        return appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment createFromRequest(AppointmentRequest requestEntity,
            Long patientId,
            Long doctorId,
            LocalDateTime scheduledAt,
            User staffUser,
            Integer duration) {

        // 1. TÌM CA LÀM VIỆC PHÙ HỢP
        List<DoctorSchedule> schedules = doctorScheduleRepository.findSchedulesForDoctorAt(doctorId,
                scheduledAt.getDayOfWeek(), scheduledAt.toLocalTime());

        if (schedules.isEmpty()) {
            throw new IllegalStateException("Bác sĩ không có lịch làm việc vào thời gian đã chọn.");
        }
        // Giả sử một bác sĩ chỉ có 1 ca làm việc tại 1 thời điểm
        DoctorSchedule schedule = schedules.get(0);

        // 2. TỰ ĐỘNG LẤY PHÒNG KHÁM TỪ CA LÀM VIỆC
        ClinicRoom clinicRoom = schedule.getClinicRoom();

        Patient patient = loadPatient(patientId);
        Doctor doctor = loadDoctor(doctorId);

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setClinicRoom(clinicRoom);
        appointment.setScheduledAt(scheduledAt);
        appointment.setDuration(resolveDuration(duration));
        appointment.setReason(requestEntity.getSymptomDescription());
        appointment.setStatus(AppointmentStatus.CONFIRMED);
        appointment.setRequest(requestEntity);
        appointment.setCreatedBy(staffUser);

        validateBean(appointment);
        ensureAvailability(appointment, null);
        return appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment updateAppointment(Long id, AppointmentUpdateRequest request) {
        Appointment appointment = getById(id);

        if (request.getPatientId() != null && !request.getPatientId().equals(appointment.getPatient().getId())) {
            appointment.setPatient(loadPatient(request.getPatientId()));
        }

        if (request.getDoctorId() != null && !request.getDoctorId().equals(appointment.getDoctor().getId())) {
            appointment.setDoctor(loadDoctor(request.getDoctorId()));
        }

        if (request.getClinicRoomId() != null) {
            if (appointment.getClinicRoom() == null
                    || !request.getClinicRoomId().equals(appointment.getClinicRoom().getId())) {
                appointment.setClinicRoom(loadClinicRoom(request.getClinicRoomId()));
            }
        }

        if (request.getScheduledAt() != null) {
            appointment.setScheduledAt(request.getScheduledAt());
        }

        if (request.getDuration() != null) {
            appointment.setDuration(resolveDuration(request.getDuration()));
        }

        if (request.getReason() != null) {
            appointment.setReason(request.getReason());
        }

        if (request.getNotes() != null) {
            appointment.setNotes(request.getNotes());
        }

        validateBean(appointment);
        ensureAvailability(appointment, appointment.getId());
        return appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment updateStatus(Long id, AppointmentStatusUpdateRequest request) {
        Appointment appointment = getById(id);
        appointment.setStatus(request.getStatus());
        if (request.getNote() != null) {
            appointment.setNotes(request.getNote());
        }
        return appointmentRepository.save(appointment);
    }

    @Transactional
    public void delete(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy lịch khám với id: " + id);
        }
        appointmentRepository.deleteById(id);
    }

    private void ensureAvailability(Appointment appointment, Long ignoreId) {
        LocalDateTime start = appointment.getScheduledAt();
        int duration = resolveDuration(appointment.getDuration());
        LocalDateTime end = start.plusMinutes(duration);

        // BƯỚC 1: KIỂM TRA LỊCH LÀM VIỆC
        checkDoctorWorkingHours(appointment.getDoctor().getId(), start, end);

        // BƯỚC 2: KIỂM TRA XUNG ĐỘT LỊCH HẸN
        boolean doctorConflict = appointmentRepository.existsDoctorOverlap(
                appointment.getDoctor().getId(), start, end, ignoreId) > 0;
        if (doctorConflict) {
            throw new IllegalStateException("Bác sĩ đã có lịch khám khác trong khoảng thời gian này.");
        }

        boolean roomConflict = appointmentRepository.existsClinicRoomOverlap(
                appointment.getClinicRoom().getId(), start, end, ignoreId) > 0;
        if (roomConflict) {
            throw new IllegalStateException("Phòng khám đã có lịch khám khác trong khoảng thời gian này.");
        }

    }

    private void checkDoctorWorkingHours(Long doctorId, LocalDateTime appointmentStart, LocalDateTime appointmentEnd) {
        DayOfWeek day = appointmentStart.getDayOfWeek();
        LocalTime startTime = appointmentStart.toLocalTime();
        LocalTime endTime = appointmentEnd.toLocalTime();

        List<DoctorSchedule> schedules = doctorScheduleRepository.findByDoctorId(doctorId);

        boolean isWithinWorkingHours = schedules.stream().anyMatch(schedule -> schedule.getDaysOfWeek().contains(day) &&
                !startTime.isBefore(schedule.getStartTime()) &&
                !endTime.isAfter(schedule.getEndTime()));

        if (!isWithinWorkingHours) {
            throw new IllegalStateException("Bác sĩ không có lịch làm việc vào thời gian đã chọn.");
        }
    }

    private void validateBean(Appointment appointment) {
        var violations = validator.validate(appointment);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }
    }

    private int resolveDuration(Integer duration) {
        if (duration == null || duration <= 0) {
            return 30;
        }
        return duration;
    }

    private ClinicRoom loadClinicRoom(Long clinicRoomId) {
        return clinicRoomRepository.findById(clinicRoomId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phòng với id: " + clinicRoomId));
    }

    private Patient loadPatient(Long patientId) {
        return patientRepository.findById(patientId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bệnh nhân với id: " + patientId));
    }

    private Doctor loadDoctor(Long doctorId) {
        return doctorRepository.findById(doctorId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bác sĩ với id: " + doctorId));
    }

    private User loadUserByUsername(String username) {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với email: " + username));
    }
}
