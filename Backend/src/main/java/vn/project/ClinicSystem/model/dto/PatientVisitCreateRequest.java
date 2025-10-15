package vn.project.ClinicSystem.model.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PatientVisitCreateRequest {

    @NotNull(message = "Cần chỉ định lịch khám tổng quát")
    private Long primaryAppointmentId;

    @Size(max = 500)
    private String provisionalDiagnosis;

    @Size(max = 2000)
    private String clinicalNote;
}
