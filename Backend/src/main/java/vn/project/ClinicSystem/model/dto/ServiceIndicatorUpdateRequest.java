package vn.project.ClinicSystem.model.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ServiceIndicatorUpdateRequest {

    @Size(max = 60, message = "Mã chỉ số tối đa 60 ký tự")
    private String code;

    @Size(max = 150, message = "Tên chỉ số tối đa 150 ký tự")
    private String name;

    @Size(max = 30, message = "Đơn vị tối đa 30 ký tự")
    private String unit;

    @Digits(integer = 12, fraction = 4, message = "Giá trị chuẩn không hợp lệ")
    private BigDecimal normalMin;

    @Digits(integer = 12, fraction = 4, message = "Giá trị chuẩn không hợp lệ")
    private BigDecimal normalMax;

    @Digits(integer = 12, fraction = 4, message = "Giá trị cảnh báo không hợp lệ")
    private BigDecimal criticalMin;

    @Digits(integer = 12, fraction = 4, message = "Giá trị cảnh báo không hợp lệ")
    private BigDecimal criticalMax;

    @Size(max = 500, message = "Ghi chú tối đa 500 ký tự")
    private String referenceNote;

    private Boolean required;
}
