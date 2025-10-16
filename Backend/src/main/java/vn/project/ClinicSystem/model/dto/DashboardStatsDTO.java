package vn.project.ClinicSystem.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Long totalPatients;
    private Long totalDoctors;
    private Long todayAppointments;
    private Double monthlyRevenue;
    private Long openVisits;
}
