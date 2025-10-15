package vn.project.ClinicSystem.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MedicationCreateRequest {

    @NotBlank(message = "Tên thuốc không được để trống")
    @Size(max = 150, message = "Tên thuốc tối đa 150 ký tự")
    private String name;

    @Size(max = 150, message = "Hoạt chất tối đa 150 ký tự")
    private String activeIngredient;

    @Size(max = 50, message = "Dạng bào chế tối đa 50 ký tự")
    private String form;

    @Size(max = 30, message = "Đơn vị tối đa 30 ký tự")
    private String unit;

    @PositiveOrZero(message = "Tồn kho phải >= 0")
    private Integer stockQuantity = 0;
}
