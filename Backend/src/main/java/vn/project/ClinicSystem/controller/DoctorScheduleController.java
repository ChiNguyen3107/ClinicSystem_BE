package vn.project.ClinicSystem.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import vn.project.ClinicSystem.model.DoctorSchedule;
import vn.project.ClinicSystem.service.DoctorScheduleService;

@RestController
@RequestMapping("/doctor-schedules")
public class DoctorScheduleController {

    private final DoctorScheduleService scheduleService;

    public DoctorScheduleController(DoctorScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/doctor/{doctorId}/room/{clinicRoomId}")
    public ResponseEntity<DoctorSchedule> createSchedule(
            @PathVariable("doctorId") Long doctorId,
            @PathVariable("clinicRoomId") Long clinicRoomId,
            @Valid @RequestBody DoctorSchedule schedule) {
        DoctorSchedule createdSchedule = scheduleService.createSchedule(doctorId, clinicRoomId, schedule);
        return new ResponseEntity<>(createdSchedule, HttpStatus.CREATED);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<DoctorSchedule>> getSchedules(@PathVariable("doctorId") Long doctorId) {
        return ResponseEntity.ok(scheduleService.getSchedulesForDoctor(doctorId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable("scheduleId") Long scheduleId) {
        scheduleService.deleteSchedule(scheduleId);
        return ResponseEntity.noContent().build();
    }
}
