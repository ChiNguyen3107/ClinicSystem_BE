package vn.project.ClinicSystem.model.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ServiceOrderResultEntryRequest {

    @NotNull(message = "Cần chỉ định chỉ số")
    private Long indicatorId;

    @NotNull(message = "Giá trị đo không được để trống")
    @Digits(integer = 12, fraction = 4, message = "Giá trị đo không hợp lệ")
    private BigDecimal value;

    @Size(max = 500, message = "Ghi chú tối đa 500 ký tự")
    private String note;
}
