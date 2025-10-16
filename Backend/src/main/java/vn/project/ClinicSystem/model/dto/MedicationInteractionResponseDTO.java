package vn.project.ClinicSystem.model.dto;

import java.util.List;

public class MedicationInteractionResponseDTO {
    private List<InteractionWarning> interactions;
    private String overallRisk;
    private List<String> recommendations;
    private boolean hasContraindications;

    // Inner class for interaction warnings
    public static class InteractionWarning {
        private String medication1;
        private String medication2;
        private String severity;
        private String description;
        private String recommendation;

        public InteractionWarning() {}

        public InteractionWarning(String medication1, String medication2, String severity, 
                                 String description, String recommendation) {
            this.medication1 = medication1;
            this.medication2 = medication2;
            this.severity = severity;
            this.description = description;
            this.recommendation = recommendation;
        }

        // Getters and Setters
        public String getMedication1() {
            return medication1;
        }

        public void setMedication1(String medication1) {
            this.medication1 = medication1;
        }

        public String getMedication2() {
            return medication2;
        }

        public void setMedication2(String medication2) {
            this.medication2 = medication2;
        }

        public String getSeverity() {
            return severity;
        }

        public void setSeverity(String severity) {
            this.severity = severity;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getRecommendation() {
            return recommendation;
        }

        public void setRecommendation(String recommendation) {
            this.recommendation = recommendation;
        }
    }

    // Constructors
    public MedicationInteractionResponseDTO() {}

    public MedicationInteractionResponseDTO(List<InteractionWarning> interactions, String overallRisk, 
                                          List<String> recommendations, boolean hasContraindications) {
        this.interactions = interactions;
        this.overallRisk = overallRisk;
        this.recommendations = recommendations;
        this.hasContraindications = hasContraindications;
    }

    // Getters and Setters
    public List<InteractionWarning> getInteractions() {
        return interactions;
    }

    public void setInteractions(List<InteractionWarning> interactions) {
        this.interactions = interactions;
    }

    public String getOverallRisk() {
        return overallRisk;
    }

    public void setOverallRisk(String overallRisk) {
        this.overallRisk = overallRisk;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
    }

    public boolean isHasContraindications() {
        return hasContraindications;
    }

    public void setHasContraindications(boolean hasContraindications) {
        this.hasContraindications = hasContraindications;
    }
}
