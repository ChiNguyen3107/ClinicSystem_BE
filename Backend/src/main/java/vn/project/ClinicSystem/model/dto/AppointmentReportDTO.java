package vn.project.ClinicSystem.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentReportDTO {
    private List<DoctorStats> doctorStats;
    private List<TimeStats> timeStats;
    private List<StatusStats> statusStats;
    private Long totalAppointments;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DoctorStats {
        private String doctorName;
        private String doctorSpecialty;
        private Long appointmentCount;
        private Double percentage;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TimeStats {
        private LocalDate date;
        private Long appointmentCount;
        private String dayOfWeek;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusStats {
        private String status;
        private Long count;
        private Double percentage;
    }
}
