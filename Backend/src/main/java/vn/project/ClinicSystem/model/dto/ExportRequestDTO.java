package vn.project.ClinicSystem.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExportRequestDTO {
    
    @NotNull(message = "Loại báo cáo không được để trống")
    private String reportType; // PATIENT, APPOINTMENT, BILLING
    
    @NotNull(message = "Định dạng file không được để trống")
    @Pattern(regexp = "^(EXCEL|PDF|CSV)$", message = "Định dạng file phải là EXCEL, PDF hoặc CSV")
    private String format; // EXCEL, PDF, CSV
    
    private LocalDate startDate;
    private LocalDate endDate;
    private Long doctorId;
    private String status;
    private String address;
    private String gender;
    private String ageGroup;
}
