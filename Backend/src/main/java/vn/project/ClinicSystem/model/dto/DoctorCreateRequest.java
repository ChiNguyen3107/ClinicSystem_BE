package vn.project.ClinicSystem.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DoctorCreateRequest {
    @NotNull(message = "userId không được để trống")
    private Long userId;

    @NotBlank(message = "Chuyên khoa không được để trống")
    private String specialty;

    @NotBlank(message = "Số giấy phép không được để trống")
    private String licenseNumber;

    private String examinationRoom;

    private String biography;
}