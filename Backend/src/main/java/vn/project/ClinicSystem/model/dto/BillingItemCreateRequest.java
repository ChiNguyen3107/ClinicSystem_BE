package vn.project.ClinicSystem.model.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import vn.project.ClinicSystem.model.enums.BillingItemType;

@Getter
@Setter
public class BillingItemCreateRequest {

    @NotNull(message = "Loại mục không được để trống")
    private BillingItemType itemType;

    @NotBlank(message = "Mô tả không được để trống")
    @Size(max = 180, message = "Mô tả tối đa 180 ký tự")
    private String description;

    @NotNull(message = "Cần nhập số lượng")
    @Min(value = 1, message = "Số lượng phải >= 1")
    private Integer quantity;

    @NotNull(message = "Cần nhập đơn giá")
    private BigDecimal unitPrice;
}
