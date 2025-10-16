package vn.project.ClinicSystem.model.dto;

import java.time.LocalDate;

public class PredictiveAnalyticsDTO {
    private String analysisType; // "patient_trends", "service_demand", "revenue"
    private LocalDate startDate;
    private LocalDate endDate;
    private String department;
    private String patientAgeGroup;
    private String serviceCategory;

    // Constructors
    public PredictiveAnalyticsDTO() {}

    public PredictiveAnalyticsDTO(String analysisType, LocalDate startDate, LocalDate endDate, 
                                 String department, String patientAgeGroup, String serviceCategory) {
        this.analysisType = analysisType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.department = department;
        this.patientAgeGroup = patientAgeGroup;
        this.serviceCategory = serviceCategory;
    }

    // Getters and Setters
    public String getAnalysisType() {
        return analysisType;
    }

    public void setAnalysisType(String analysisType) {
        this.analysisType = analysisType;
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

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getPatientAgeGroup() {
        return patientAgeGroup;
    }

    public void setPatientAgeGroup(String patientAgeGroup) {
        this.patientAgeGroup = patientAgeGroup;
    }

    public String getServiceCategory() {
        return serviceCategory;
    }

    public void setServiceCategory(String serviceCategory) {
        this.serviceCategory = serviceCategory;
    }
}
