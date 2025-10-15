package vn.project.ClinicSystem.model.dto;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PrescriptionUpdateRequest {

    private Long prescribedById;

    private Boolean clearPrescribedBy;

    private LocalDateTime issuedAt;

    @Size(max = 1000, message = "Ghi chú tối đa 1000 ký tự")
    private String notes;

    private List<@Valid PrescriptionItemRequest> items;
}
