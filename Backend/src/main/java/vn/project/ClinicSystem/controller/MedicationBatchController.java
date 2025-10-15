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
import vn.project.ClinicSystem.model.MedicationBatch;
import vn.project.ClinicSystem.model.dto.MedicationBatchAdjustRequest;
import vn.project.ClinicSystem.model.dto.MedicationBatchCreateRequest;
import vn.project.ClinicSystem.service.MedicationBatchService;

@RestController
@RequestMapping("/medication-batches")
public class MedicationBatchController {

    private final MedicationBatchService batchService;

    public MedicationBatchController(MedicationBatchService batchService) {
        this.batchService = batchService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<MedicationBatch> createBatch(@Valid @RequestBody MedicationBatchCreateRequest request) {
        MedicationBatch created = batchService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<MedicationBatch> updateBatch(@PathVariable("id") Long id,
            @Valid @RequestBody MedicationBatchAdjustRequest request) {
        return ResponseEntity.ok(batchService.update(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBatch(@PathVariable("id") Long id) {
        batchService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @GetMapping("/{id}")
    public ResponseEntity<MedicationBatch> getBatch(@PathVariable("id") Long id) {
        return ResponseEntity.ok(batchService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @GetMapping
    public ResponseEntity<List<MedicationBatch>> listBatches(
            @RequestParam("medicationId") Long medicationId) {
        return ResponseEntity.ok(batchService.listByMedication(medicationId));
    }
}
