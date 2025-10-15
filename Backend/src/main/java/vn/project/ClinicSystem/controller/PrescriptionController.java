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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.project.ClinicSystem.model.Prescription;
import vn.project.ClinicSystem.model.dto.PrescriptionCreateRequest;
import vn.project.ClinicSystem.model.dto.PrescriptionUpdateRequest;
import vn.project.ClinicSystem.service.PrescriptionService;

@RestController
@RequestMapping("/prescriptions")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @PostMapping
    public ResponseEntity<Prescription> createPrescription(
            @Valid @RequestBody PrescriptionCreateRequest request) {
        Prescription created = prescriptionService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getPrescription(@PathVariable("id") Long id) {
        return ResponseEntity.ok(prescriptionService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @GetMapping
    public ResponseEntity<List<Prescription>> getPrescriptions(
            @RequestParam(value = "visitId", required = false) Long visitId) {
        if (visitId != null) {
            return ResponseEntity.ok(prescriptionService.findByVisit(visitId));
        }
        return ResponseEntity.ok(prescriptionService.findAll());
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @PutMapping("/{id}")
    public ResponseEntity<Prescription> updatePrescription(
            @PathVariable("id") Long id,
            @Valid @RequestBody PrescriptionUpdateRequest request) {
        Prescription updated = prescriptionService.update(id, request);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable("id") Long id) {
        prescriptionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
