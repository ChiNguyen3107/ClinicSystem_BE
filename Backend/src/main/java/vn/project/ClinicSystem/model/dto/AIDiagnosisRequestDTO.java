package vn.project.ClinicSystem.model.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class AIDiagnosisRequestDTO {
    @NotBlank(message = "Triệu chứng không được để trống")
    private String symptoms;
    
    private List<String> testResults;
    
    private String patientAge;
    
    private String patientGender;
    
    private String medicalHistory;

    // Constructors
    public AIDiagnosisRequestDTO() {}

    public AIDiagnosisRequestDTO(String symptoms, List<String> testResults, String patientAge, String patientGender, String medicalHistory) {
        this.symptoms = symptoms;
        this.testResults = testResults;
        this.patientAge = patientAge;
        this.patientGender = patientGender;
        this.medicalHistory = medicalHistory;
    }

    // Getters and Setters
    public String getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }

    public List<String> getTestResults() {
        return testResults;
    }

    public void setTestResults(List<String> testResults) {
        this.testResults = testResults;
    }

    public String getPatientAge() {
        return patientAge;
    }

    public void setPatientAge(String patientAge) {
        this.patientAge = patientAge;
    }

    public String getPatientGender() {
        return patientGender;
    }

    public void setPatientGender(String patientGender) {
        this.patientGender = patientGender;
    }

    public String getMedicalHistory() {
        return medicalHistory;
    }

    public void setMedicalHistory(String medicalHistory) {
        this.medicalHistory = medicalHistory;
    }
}
