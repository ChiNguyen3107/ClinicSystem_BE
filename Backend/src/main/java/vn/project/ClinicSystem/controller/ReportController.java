package vn.project.ClinicSystem.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import vn.project.ClinicSystem.model.dto.*;
import vn.project.ClinicSystem.service.ReportService;

import java.time.LocalDate;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    /**
     * Báo cáo bệnh nhân
     * - Thống kê theo độ tuổi
     * - Thống kê theo giới tính  
     * - Thống kê theo địa chỉ
     */
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @GetMapping("/patients")
    public ResponseEntity<PatientReportDTO> getPatientReport(
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String ageGroup) {
        
        PatientReportDTO report = reportService.generatePatientReport(gender, address, ageGroup);
        return ResponseEntity.ok(report);
    }

    /**
     * Báo cáo lịch hẹn
     * - Thống kê theo bác sĩ
     * - Thống kê theo thời gian
     * - Thống kê theo trạng thái
     */
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @GetMapping("/appointments")
    public ResponseEntity<AppointmentReportDTO> getAppointmentReport(
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) String status) {
        
        AppointmentReportDTO report = reportService.generateAppointmentReport(doctorId, startDate, endDate, status);
        return ResponseEntity.ok(report);
    }

    /**
     * Báo cáo tài chính
     * - Doanh thu theo tháng
     * - Doanh thu theo dịch vụ
     * - Doanh thu theo bác sĩ
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/billing")
    public ResponseEntity<BillingReportDTO> getBillingReport(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) Long doctorId) {
        
        BillingReportDTO report = reportService.generateBillingReport(startDate, endDate, doctorId);
        return ResponseEntity.ok(report);
    }

    /**
     * Xuất báo cáo
     * - Hỗ trợ format: Excel, PDF, CSV
     * - Hỗ trợ filter: date range, doctor, status
     */
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @PostMapping("/export")
    public ResponseEntity<byte[]> exportReport(@Valid @RequestBody ExportRequestDTO request) {
        try {
            byte[] fileContent = reportService.exportReport(request);
            
            String fileName = generateFileName(request);
            String contentType = getContentType(request.getFormat());
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.setContentDispositionFormData("attachment", fileName);
            headers.setContentLength(fileContent.length);
            
            return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Xuất báo cáo theo loại (GET method)
     */
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @GetMapping("/export/{type}")
    public ResponseEntity<byte[]> exportReportByType(
            @PathVariable String type,
            @RequestParam String format,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) String status) {
        
        ExportRequestDTO request = new ExportRequestDTO();
        request.setReportType(type.toUpperCase());
        request.setFormat(format.toUpperCase());
        request.setStartDate(startDate);
        request.setEndDate(endDate);
        request.setDoctorId(doctorId);
        request.setStatus(status);
        
        return exportReport(request);
    }

    private String generateFileName(ExportRequestDTO request) {
        String timestamp = LocalDate.now().toString();
        return String.format("report_%s_%s.%s", 
            request.getReportType().toLowerCase(), 
            timestamp, 
            request.getFormat().toLowerCase());
    }

    private String getContentType(String format) {
        return switch (format.toUpperCase()) {
            case "EXCEL" -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case "PDF" -> "application/pdf";
            case "CSV" -> "text/csv";
            default -> "application/octet-stream";
        };
    }
}
