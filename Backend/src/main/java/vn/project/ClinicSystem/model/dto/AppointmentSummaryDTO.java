package vn.project.ClinicSystem.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentSummaryDTO {
    private Long id;
    private String patientName;
    private String doctorName;
    private LocalDateTime appointmentTime;
    private String status;
    private String clinicRoom;
    private String notes;
}
