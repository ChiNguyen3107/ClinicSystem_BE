package vn.project.ClinicSystem.model.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import vn.project.ClinicSystem.model.enums.ServiceOrderStatus;

@Getter
@Setter
public class ServiceOrderStatusUpdateRequest {

    @NotNull(message = "Trạng thái không được để trống")
    private ServiceOrderStatus status;

    @Size(max = 1000)
    private String resultNote;
}
