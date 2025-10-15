package vn.project.ClinicSystem.model.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import vn.project.ClinicSystem.model.enums.BillingItemType;

@Getter
@Setter
public class BillingItemUpdateRequest {

    private BillingItemType itemType;

    @Size(max = 180, message = "Mô tả tối đa 180 ký tự")
    private String description;

    @Min(value = 1, message = "Số lượng phải >= 1")
    private Integer quantity;

    private BigDecimal unitPrice;
}
