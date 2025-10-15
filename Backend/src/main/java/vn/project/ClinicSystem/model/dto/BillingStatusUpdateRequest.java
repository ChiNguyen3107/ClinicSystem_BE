package vn.project.ClinicSystem.model.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import vn.project.ClinicSystem.model.enums.BillingStatus;

@Getter
@Setter
public class BillingStatusUpdateRequest {

    @NotNull(message = "Trạng thái hóa đơn không được để trống")
    private BillingStatus status;

    @Size(max = 60, message = "Phương thức thanh toán tối đa 60 ký tự")
    private String paymentMethod;

    @Size(max = 255, message = "Ghi chú tối đa 255 ký tự")
    private String notes;
}
