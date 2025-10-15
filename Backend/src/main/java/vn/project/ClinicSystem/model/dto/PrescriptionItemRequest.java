package vn.project.ClinicSystem.model.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PrescriptionItemRequest {

    private Long medicationId;

    private Long batchId;

    @NotNull(message = "Số lượng thuốc không được để trống")
    @Min(value = 1, message = "Số lượng phải >= 1")
    private Integer quantity;

    @Size(max = 120, message = "Tên thuốc tối đa 120 ký tự")
    private String medicationName;

    @NotBlank(message = "Liều dùng không được để trống")
    @Size(max = 80, message = "Liều dùng tối đa 80 ký tự")
    private String dosage;

    @NotBlank(message = "Tần suất không được để trống")
    @Size(max = 80, message = "Tần suất tối đa 80 ký tự")
    private String frequency;

    @Size(max = 80, message = "Thời gian sử dụng tối đa 80 ký tự")
    private String duration;

    @Size(max = 255, message = "Hướng dẫn tối đa 255 ký tự")
    private String instruction;
}
