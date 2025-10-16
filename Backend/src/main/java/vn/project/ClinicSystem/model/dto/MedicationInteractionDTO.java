package vn.project.ClinicSystem.model.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class MedicationInteractionDTO {
    @NotEmpty(message = "Danh sách thuốc không được để trống")
    private List<String> medications;
    
    private String patientId;
    
    private String patientAge;
    
    private String patientWeight;

    // Constructors
    public MedicationInteractionDTO() {}

    public MedicationInteractionDTO(List<String> medications, String patientId, String patientAge, String patientWeight) {
        this.medications = medications;
        this.patientId = patientId;
        this.patientAge = patientAge;
        this.patientWeight = patientWeight;
    }

    // Getters and Setters
    public List<String> getMedications() {
        return medications;
    }

    public void setMedications(List<String> medications) {
        this.medications = medications;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getPatientAge() {
        return patientAge;
    }

    public void setPatientAge(String patientAge) {
        this.patientAge = patientAge;
    }

    public String getPatientWeight() {
        return patientWeight;
    }

    public void setPatientWeight(String patientWeight) {
        this.patientWeight = patientWeight;
    }
}
