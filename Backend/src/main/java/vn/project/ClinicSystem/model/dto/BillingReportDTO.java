package vn.project.ClinicSystem.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BillingReportDTO {
    private List<MonthlyRevenue> monthlyRevenue;
    private List<ServiceRevenue> serviceRevenue;
    private List<DoctorRevenue> doctorRevenue;
    private BigDecimal totalRevenue;
    private BigDecimal averageRevenue;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyRevenue {
        private String month;
        private Integer year;
        private BigDecimal revenue;
        private Long transactionCount;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ServiceRevenue {
        private String serviceName;
        private BigDecimal revenue;
        private Long usageCount;
        private Double percentage;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DoctorRevenue {
        private String doctorName;
        private String doctorSpecialty;
        private BigDecimal revenue;
        private Long patientCount;
        private Double percentage;
    }
}
