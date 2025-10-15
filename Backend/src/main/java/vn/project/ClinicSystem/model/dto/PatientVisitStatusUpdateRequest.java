package vn.project.ClinicSystem.model.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import vn.project.ClinicSystem.model.enums.VisitStatus;

@Getter
@Setter
public class PatientVisitStatusUpdateRequest {

    @NotNull(message = "Trạng thái không được để trống")
    private VisitStatus status;
}
