package vn.project.ClinicSystem.model.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import vn.project.ClinicSystem.model.enums.AppointmentStatus;

@Getter
@Setter
public class AppointmentStatusUpdateRequest {

    @NotNull(message = "Trạng thái không được để trống")
    private AppointmentStatus status;

    private String note;
}
