package vn.project.ClinicSystem.model.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppointmentRequestApproveRequest {

    @Positive(message = "Mã bệnh nhân không hợp lệ")
    private Long patientId;

    @NotNull(message = "Cần chỉ định bác sĩ khám")
    private Long doctorId;

    @NotNull(message = "Cần chọn thời gian khám")
    private LocalDateTime scheduledAt;

    @Positive(message = "Thời lượng khám phải lớn hơn 0")
    private Integer duration;

    private String staffNote;
}
