package vn.project.ClinicSystem.model.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MedicationBatchCreateRequest {

    @NotNull(message = "Cần chọn thuốc")
    private Long medicationId;

    @Size(max = 60, message = "Mã lô tối đa 60 ký tự")
    private String batchCode;

    @Size(max = 150, message = "Xuất xứ tối đa 150 ký tự")
    private String origin;

    private LocalDate manufactureDate;
    private LocalDate expiryDate;

    @NotNull(message = "Đơn giá không được để trống")
    private BigDecimal unitPrice;

    @Min(value = 1, message = "Số gói phải >= 1")
    private Integer packageCount;

    @Min(value = 1, message = "Số đơn vị mỗi gói phải >= 1")
    private Integer unitsPerPackage;

    @Min(value = 1, message = "Tổng số đơn vị phải >= 1")
    private Integer totalUnits;
}
