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
import vn.project.ClinicSystem.model.Billing;
import vn.project.ClinicSystem.model.BillingItem;
import vn.project.ClinicSystem.model.dto.BillingItemCreateRequest;
import vn.project.ClinicSystem.model.dto.BillingItemUpdateRequest;
import vn.project.ClinicSystem.model.dto.BillingStatusUpdateRequest;
import vn.project.ClinicSystem.service.BillingService;

@RestController
@RequestMapping("/billings")
public class BillingController {

    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @GetMapping("/{id}")
    public ResponseEntity<Billing> getBilling(@PathVariable("id") Long id) {
        return ResponseEntity.ok(billingService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @GetMapping
    public ResponseEntity<List<Billing>> getBillings(
            @RequestParam(value = "patientId", required = false) Long patientId,
            @RequestParam(value = "visitId", required = false) Long visitId) {
        if (visitId != null) {
            return ResponseEntity.ok(List.of(billingService.getByVisit(visitId)));
        }
        if (patientId != null) {
            return ResponseEntity.ok(billingService.findByPatient(patientId));
        }
        return ResponseEntity.ok(billingService.findAll());
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @PostMapping("/visits/{visitId}/generate")
    public ResponseEntity<Billing> generateBilling(@PathVariable("visitId") Long visitId) {
        Billing billing = billingService.generateForVisit(visitId);
        return ResponseEntity.status(HttpStatus.CREATED).body(billing);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public ResponseEntity<Billing> updateStatus(
            @PathVariable("id") Long id,
            @Valid @RequestBody BillingStatusUpdateRequest request) {
        return ResponseEntity.ok(billingService.updateStatus(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/items")
    public ResponseEntity<Billing> addManualItem(
            @PathVariable("id") Long id,
            @Valid @RequestBody BillingItemCreateRequest request) {
        Billing billing = billingService.addManualItem(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(billing);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{billingId}/items/{itemId}")
    public ResponseEntity<BillingItem> updateItem(
            @PathVariable("billingId") Long billingId,
            @PathVariable("itemId") Long itemId,
            @Valid @RequestBody BillingItemUpdateRequest request) {
        return ResponseEntity.ok(billingService.updateItem(billingId, itemId, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{billingId}/items/{itemId}")
    public ResponseEntity<Void> deleteItem(
            @PathVariable("billingId") Long billingId,
            @PathVariable("itemId") Long itemId) {
        billingService.deleteItem(billingId, itemId);
        return ResponseEntity.noContent().build();
    }
}
