package vn.project.ClinicSystem.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MedicalServiceRequest {

    @NotBlank(message = "Mã dịch vụ không được để trống")
    private String code;

    @NotBlank(message = "Tên dịch vụ không được để trống")
    private String name;

    @NotNull(message = "Đơn giá không được để trống")
    private Long basePrice;

    @NotNull(message = "Cần chỉ định phòng khám")
    private Long clinicRoomId;
}
