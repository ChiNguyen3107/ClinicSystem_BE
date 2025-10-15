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
import vn.project.ClinicSystem.model.Medication;
import vn.project.ClinicSystem.model.dto.MedicationCreateRequest;
import vn.project.ClinicSystem.model.dto.MedicationUpdateRequest;
import vn.project.ClinicSystem.service.MedicationService;

@RestController
@RequestMapping("/medications")
public class MedicationController {

    private final MedicationService medicationService;

    public MedicationController(MedicationService medicationService) {
        this.medicationService = medicationService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Medication> createMedication(@Valid @RequestBody MedicationCreateRequest request) {
        Medication created = medicationService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<Medication>> getMedications() {
        return ResponseEntity.ok(medicationService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medication> getMedication(@PathVariable("id") Long id) {
        return ResponseEntity.ok(medicationService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Medication> updateMedication(
            @PathVariable("id") Long id,
            @Valid @RequestBody MedicationUpdateRequest request) {
        Medication updated = medicationService.update(id, request);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedication(@PathVariable("id") Long id) {
        medicationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
