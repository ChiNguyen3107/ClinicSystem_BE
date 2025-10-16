package vn.project.ClinicSystem.controller;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import vn.project.ClinicSystem.repository.DoctorRepository;
import vn.project.ClinicSystem.repository.PatientRepository;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getHealthStatus() {
        Map<String, Object> status = new HashMap<>();
        
        try {
            // Kiểm tra database connection
            dataSource.getConnection().close();
            status.put("database", "UP");
        } catch (Exception e) {
            status.put("database", "DOWN");
        }

        // Kiểm tra số lượng records
        try {
            long doctorCount = doctorRepository.count();
            long patientCount = patientRepository.count();
            
            status.put("doctors", doctorCount);
            status.put("patients", patientCount);
            status.put("records", "UP");
        } catch (Exception e) {
            status.put("records", "DOWN");
        }

        status.put("timestamp", Instant.now());
        status.put("status", status.containsValue("DOWN") ? "DOWN" : "UP");

        return ResponseEntity.ok(status);
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        try {
            long doctorCount = doctorRepository.count();
            long patientCount = patientRepository.count();
            
            metrics.put("total_doctors", doctorCount);
            metrics.put("total_patients", patientCount);
            metrics.put("timestamp", Instant.now());
            
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            metrics.put("error", "Không thể lấy metrics");
            return ResponseEntity.status(500).body(metrics);
        }
    }
}
