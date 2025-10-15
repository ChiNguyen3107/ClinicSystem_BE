package vn.project.ClinicSystem.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppointmentRequestRejectRequest {

    @NotBlank(message = "Cần ghi chú lý do từ chối")
    private String staffNote;
}
