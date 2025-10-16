package vn.project.ClinicSystem.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.project.ClinicSystem.model.Doctor;
import vn.project.ClinicSystem.model.Patient;
import vn.project.ClinicSystem.service.BatchService;

@RestController
@RequestMapping("/api/batch")
@RequiredArgsConstructor
public class BatchController {

    private final BatchService batchService;

    @PostMapping("/doctors")
    public ResponseEntity<List<Doctor>> batchCreateDoctors(@RequestBody List<Doctor> doctors) {
        try {
            List<Doctor> savedDoctors = batchService.batchCreateDoctors(doctors);
            return ResponseEntity.ok(savedDoctors);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/patients")
    public ResponseEntity<List<Patient>> batchCreatePatients(@RequestBody List<Patient> patients) {
        try {
            List<Patient> savedPatients = batchService.batchCreatePatients(patients);
            return ResponseEntity.ok(savedPatients);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/doctors/async")
    public ResponseEntity<String> asyncBatchUpdateDoctors(@RequestBody List<Doctor> doctors) {
        try {
            batchService.asyncBatchUpdateDoctors(doctors);
            return ResponseEntity.ok("Batch update đã được khởi tạo cho " + doctors.size() + " doctors");
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/patients/async")
    public ResponseEntity<String> asyncBatchUpdatePatients(@RequestBody List<Patient> patients) {
        try {
            batchService.asyncBatchUpdatePatients(patients);
            return ResponseEntity.ok("Batch update đã được khởi tạo cho " + patients.size() + " patients");
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/doctors")
    public ResponseEntity<String> bulkDeleteDoctors(@RequestParam List<Long> ids) {
        try {
            batchService.bulkDeleteDoctors(ids);
            return ResponseEntity.ok("Đã xóa " + ids.size() + " doctors");
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/patients")
    public ResponseEntity<String> bulkDeletePatients(@RequestParam List<Long> ids) {
        try {
            batchService.bulkDeletePatients(ids);
            return ResponseEntity.ok("Đã xóa " + ids.size() + " patients");
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
