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
import vn.project.ClinicSystem.model.MedicalService;
import vn.project.ClinicSystem.model.dto.MedicalServiceRequest;
import vn.project.ClinicSystem.model.dto.MedicalServiceUpdateRequest;
import vn.project.ClinicSystem.service.MedicalServiceService;

@RestController
@RequestMapping("/medical-services")
public class MedicalServiceController {

    private final MedicalServiceService medicalServiceService;

    public MedicalServiceController(MedicalServiceService medicalServiceService) {
        this.medicalServiceService = medicalServiceService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<MedicalService> createMedicalService(
            @Valid @RequestBody MedicalServiceRequest request) {
        MedicalService created = medicalServiceService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<MedicalService>> getMedicalServices(
            @RequestParam(value = "clinicRoomId", required = false) Long clinicRoomId) {
        if (clinicRoomId != null) {
            return ResponseEntity.ok(medicalServiceService.findByClinicRoom(clinicRoomId));
        }
        return ResponseEntity.ok(medicalServiceService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalService> getMedicalServiceById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(medicalServiceService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<MedicalService> updateMedicalService(
            @PathVariable("id") Long id,
            @Valid @RequestBody MedicalServiceUpdateRequest request) {
        MedicalService updated = medicalServiceService.update(id, request);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicalService(@PathVariable("id") Long id) {
        medicalServiceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
