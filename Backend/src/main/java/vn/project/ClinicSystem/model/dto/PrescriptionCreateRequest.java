package vn.project.ClinicSystem.model.dto;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PrescriptionCreateRequest {

    @NotNull(message = "Cần chỉ định hồ sơ khám")
    private Long visitId;

    private Long prescribedById;

    private LocalDateTime issuedAt;

    @Size(max = 1000, message = "Ghi chú tối đa 1000 ký tự")
    private String notes;

    @NotEmpty(message = "Đơn thuốc phải có ít nhất 1 thuốc")
    private List<@Valid PrescriptionItemRequest> items;
}
