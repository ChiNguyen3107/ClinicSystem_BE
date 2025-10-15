package vn.project.ClinicSystem.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.project.ClinicSystem.model.PatientVisit;
import vn.project.ClinicSystem.model.ServiceOrder;
import vn.project.ClinicSystem.model.dto.PatientVisitCreateRequest;
import vn.project.ClinicSystem.model.dto.PatientVisitStatusUpdateRequest;
import vn.project.ClinicSystem.model.dto.ServiceOrderCreateRequest;
import vn.project.ClinicSystem.model.dto.ServiceOrderStatusUpdateRequest;
import vn.project.ClinicSystem.service.VisitService;

@RestController
@RequestMapping("/visits")
public class VisitController {

    private final VisitService visitService;

    public VisitController(VisitService visitService) {
        this.visitService = visitService;
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @PostMapping
    public ResponseEntity<PatientVisit> createVisit(@Valid @RequestBody PatientVisitCreateRequest request) {
        PatientVisit created = visitService.createVisit(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @GetMapping("/{id}")
    public ResponseEntity<PatientVisit> getVisit(@PathVariable("id") Long id) {
        return ResponseEntity.ok(visitService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @GetMapping
    public ResponseEntity<List<PatientVisit>> getVisitsByPatient(
            @RequestParam(value = "patientId", required = false) Long patientId) {
        if (patientId != null) {
            return ResponseEntity.ok(visitService.findByPatient(patientId));
        }
        return ResponseEntity.ok(visitService.findAll());
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @GetMapping("/{id}/service-orders")
    public ResponseEntity<List<ServiceOrder>> getServiceOrders(@PathVariable("id") Long id) {
        return ResponseEntity.ok(visitService.findServiceOrders(id));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @PostMapping("/{id}/service-orders")
    public ResponseEntity<List<ServiceOrder>> createServiceOrders(
            @PathVariable("id") Long id,
            @RequestBody List<@Valid ServiceOrderCreateRequest> requests) {
        List<ServiceOrder> created = visitService.createServiceOrders(id, requests);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<PatientVisit> updateVisitStatus(@PathVariable("id") Long id,
            @Valid @RequestBody PatientVisitStatusUpdateRequest request) {
        return ResponseEntity.ok(visitService.updateStatus(id, request));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @PatchMapping("/service-orders/{id}/status")
    public ResponseEntity<ServiceOrder> updateServiceOrderStatus(@PathVariable("id") Long id,
            @Valid @RequestBody ServiceOrderStatusUpdateRequest request) {
        return ResponseEntity.ok(visitService.updateServiceOrderStatus(id, request));
    }
}
