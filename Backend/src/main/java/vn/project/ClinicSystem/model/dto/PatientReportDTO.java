package vn.project.ClinicSystem.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientReportDTO {
    private List<AgeGroupStats> ageGroupStats;
    private List<GenderStats> genderStats;
    private List<AddressStats> addressStats;
    private Long totalPatients;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AgeGroupStats {
        private String ageGroup;
        private Long count;
        private Double percentage;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GenderStats {
        private String gender;
        private Long count;
        private Double percentage;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddressStats {
        private String address;
        private Long count;
        private Double percentage;
    }
}
