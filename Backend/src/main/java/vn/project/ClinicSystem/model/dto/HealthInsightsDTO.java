package vn.project.ClinicSystem.model.dto;

import java.time.LocalDate;
import java.util.List;

public class HealthInsightsDTO {
    private String insightType; // "community_health", "disease_trends", "prevention"
    private LocalDate startDate;
    private LocalDate endDate;
    private String region;
    private String ageGroup;
    private List<String> diseases;
    private String gender;

    // Constructors
    public HealthInsightsDTO() {}

    public HealthInsightsDTO(String insightType, LocalDate startDate, LocalDate endDate, 
                            String region, String ageGroup, List<String> diseases, String gender) {
        this.insightType = insightType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.region = region;
        this.ageGroup = ageGroup;
        this.diseases = diseases;
        this.gender = gender;
    }

    // Getters and Setters
    public String getInsightType() {
        return insightType;
    }

    public void setInsightType(String insightType) {
        this.insightType = insightType;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getAgeGroup() {
        return ageGroup;
    }

    public void setAgeGroup(String ageGroup) {
        this.ageGroup = ageGroup;
    }

    public List<String> getDiseases() {
        return diseases;
    }

    public void setDiseases(List<String> diseases) {
        this.diseases = diseases;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }
}
