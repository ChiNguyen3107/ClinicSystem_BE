package vn.project.ClinicSystem.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.project.ClinicSystem.model.ServiceIndicator;
import vn.project.ClinicSystem.model.dto.ServiceIndicatorCreateRequest;
import vn.project.ClinicSystem.model.dto.ServiceIndicatorUpdateRequest;
import vn.project.ClinicSystem.service.ServiceIndicatorService;

@RestController
@RequestMapping("/medical-services/{serviceId}/indicators")
public class ServiceIndicatorController {

    private final ServiceIndicatorService indicatorService;

    public ServiceIndicatorController(ServiceIndicatorService indicatorService) {
        this.indicatorService = indicatorService;
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @GetMapping
    public ResponseEntity<List<ServiceIndicator>> listIndicators(@PathVariable("serviceId") Long serviceId) {
        return ResponseEntity.ok(indicatorService.listByMedicalService(serviceId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ServiceIndicator> createIndicator(
            @PathVariable("serviceId") Long serviceId,
            @Valid @RequestBody ServiceIndicatorCreateRequest request) {
        ServiceIndicator created = indicatorService.create(serviceId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{indicatorId}")
    public ResponseEntity<ServiceIndicator> updateIndicator(
            @PathVariable("serviceId") Long serviceId,
            @PathVariable("indicatorId") Long indicatorId,
            @Valid @RequestBody ServiceIndicatorUpdateRequest request) {
        ServiceIndicator existing = indicatorService.getById(indicatorId);
        if (!existing.getMedicalService().getId().equals(serviceId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        ServiceIndicator updated = indicatorService.update(indicatorId, request);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{indicatorId}")
    public ResponseEntity<Void> deleteIndicator(
            @PathVariable("serviceId") Long serviceId,
            @PathVariable("indicatorId") Long indicatorId) {
        ServiceIndicator existing = indicatorService.getById(indicatorId);
        if (!existing.getMedicalService().getId().equals(serviceId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        indicatorService.delete(indicatorId);
        return ResponseEntity.noContent().build();
    }
}
