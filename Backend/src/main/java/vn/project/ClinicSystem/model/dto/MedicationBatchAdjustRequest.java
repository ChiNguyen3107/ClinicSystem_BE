package vn.project.ClinicSystem.model.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MedicationBatchAdjustRequest {

    @Size(max = 60, message = "Mã lô tối đa 60 ký tự")
    private String batchCode;

    @Size(max = 150, message = "Xuất xứ tối đa 150 ký tự")
    private String origin;

    private LocalDate manufactureDate;
    private LocalDate expiryDate;

    private BigDecimal unitPrice;

    @Min(value = 0, message = "Số gói phải >= 0")
    private Integer packageCount;

    @Min(value = 1, message = "Số đơn vị mỗi gói phải >= 1")
    private Integer unitsPerPackage;

    @Min(value = 0, message = "Tổng số đơn vị phải >= 0")
    private Integer totalUnits;
}
