package vn.project.ClinicSystem.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChartDataDTO {
    private List<MonthlyRevenueData> monthlyRevenue;
    private List<MonthlyPatientData> monthlyPatients;
    private List<AppointmentStatusData> appointmentStatus;
    private List<PopularServiceData> popularServices;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyRevenueData {
        private String month;
        private Double revenue;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyPatientData {
        private String month;
        private Long patientCount;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AppointmentStatusData {
        private String status;
        private Long count;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PopularServiceData {
        private String serviceName;
        private Long usageCount;
    }
}
