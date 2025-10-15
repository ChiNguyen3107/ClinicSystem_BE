package vn.project.ClinicSystem.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.project.ClinicSystem.model.AppointmentRequest;
import vn.project.ClinicSystem.model.dto.AppointmentRequestApproveRequest;
import vn.project.ClinicSystem.model.dto.AppointmentRequestCreateRequest;
import vn.project.ClinicSystem.model.dto.AppointmentRequestRejectRequest;
import vn.project.ClinicSystem.model.enums.AppointmentRequestStatus;
import vn.project.ClinicSystem.service.AppointmentRequestService;
import vn.project.ClinicSystem.util.SecurityUtil;

@RestController
@RequestMapping("/appointment-requests")
public class AppointmentRequestController {

    private final AppointmentRequestService appointmentRequestService;

    public AppointmentRequestController(AppointmentRequestService appointmentRequestService) {
        this.appointmentRequestService = appointmentRequestService;
    }

    @PostMapping
    public ResponseEntity<AppointmentRequest> createAppointmentRequest(
            @Valid @RequestBody AppointmentRequestCreateRequest request) {
        AppointmentRequest created = appointmentRequestService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<AppointmentRequest>> getAppointmentRequests(
            @RequestParam(value = "status", required = false) AppointmentRequestStatus status) {
        if (status != null) {
            return ResponseEntity.ok(appointmentRequestService.findByStatus(status));
        }
        return ResponseEntity.ok(appointmentRequestService.findAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<AppointmentRequest> getAppointmentRequestById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(appointmentRequestService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/approve")
    public ResponseEntity<AppointmentRequest> approveAppointmentRequest(
            @PathVariable("id") Long id,
            @Valid @RequestBody AppointmentRequestApproveRequest request) {
        String staffUsername = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new IllegalStateException("Không thể xác định người dùng đang đăng nhập"));
        AppointmentRequest approved = appointmentRequestService.approve(id, request, staffUsername);
        return ResponseEntity.ok(approved);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/reject")
    public ResponseEntity<AppointmentRequest> rejectAppointmentRequest(
            @PathVariable("id") Long id,
            @Valid @RequestBody AppointmentRequestRejectRequest request) {
        String staffUsername = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new IllegalStateException("Không thể xác định người dùng đang đăng nhập"));
        AppointmentRequest rejected = appointmentRequestService.reject(id, request, staffUsername);
        return ResponseEntity.ok(rejected);
    }
}
