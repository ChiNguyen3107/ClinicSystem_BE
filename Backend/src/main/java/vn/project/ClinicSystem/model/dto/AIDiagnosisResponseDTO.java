package vn.project.ClinicSystem.model.dto;

import java.util.List;

public class AIDiagnosisResponseDTO {
    private List<String> suggestedDiagnoses;
    private List<Double> confidenceScores;
    private String recommendation;
    private String severity;
    private List<String> suggestedTests;

    // Constructors
    public AIDiagnosisResponseDTO() {}

    public AIDiagnosisResponseDTO(List<String> suggestedDiagnoses, List<Double> confidenceScores, 
                                 String recommendation, String severity, List<String> suggestedTests) {
        this.suggestedDiagnoses = suggestedDiagnoses;
        this.confidenceScores = confidenceScores;
        this.recommendation = recommendation;
        this.severity = severity;
        this.suggestedTests = suggestedTests;
    }

    // Getters and Setters
    public List<String> getSuggestedDiagnoses() {
        return suggestedDiagnoses;
    }

    public void setSuggestedDiagnoses(List<String> suggestedDiagnoses) {
        this.suggestedDiagnoses = suggestedDiagnoses;
    }

    public List<Double> getConfidenceScores() {
        return confidenceScores;
    }

    public void setConfidenceScores(List<Double> confidenceScores) {
        this.confidenceScores = confidenceScores;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public List<String> getSuggestedTests() {
        return suggestedTests;
    }

    public void setSuggestedTests(List<String> suggestedTests) {
        this.suggestedTests = suggestedTests;
    }
}
