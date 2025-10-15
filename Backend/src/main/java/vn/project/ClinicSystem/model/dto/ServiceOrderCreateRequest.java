package vn.project.ClinicSystem.model.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ServiceOrderCreateRequest {

    @NotNull(message = "Cần chọn dịch vụ chuyên khoa")
    private Long medicalServiceId;

    @NotNull(message = "Cần chọn bác sĩ phụ trách")
    private Long assignedDoctorId;

    @Size(max = 500)
    private String note;
}
