package vn.project.ClinicSystem.model.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppointmentUpdateRequest {

    private Long patientId;
    private Long doctorId;
    private Long clinicRoomId;
    private LocalDateTime scheduledAt;
    private String reason;
    private String notes;
    private Integer duration;
}
