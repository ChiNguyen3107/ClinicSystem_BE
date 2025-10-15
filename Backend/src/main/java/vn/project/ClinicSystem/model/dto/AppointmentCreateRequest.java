package vn.project.ClinicSystem.model.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppointmentCreateRequest {

    @NotNull(message = "Bệnh nhân không được để trống")
    private Long patientId;

    @NotNull(message = "Bác sĩ không được để trống")
    private Long doctorId;

    @NotNull(message = "Thời gian khám không được để trống")
    private LocalDateTime scheduledAt;

    @NotNull(message = "Phòng khám không được để trống")
    private Long clinicRoomId;

    private String reason;
    private String notes;

    @Positive(message = "Thời lượng khám phải lớn hơn 0")
    private Integer duration;
}
