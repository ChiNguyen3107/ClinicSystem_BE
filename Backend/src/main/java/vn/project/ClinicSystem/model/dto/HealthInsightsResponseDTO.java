package vn.project.ClinicSystem.model.dto;

import java.util.List;
import java.util.Map;

public class HealthInsightsResponseDTO {
    private String insightType;
    private List<HealthTrend> trends;
    private List<DiseasePattern> diseasePatterns;
    private List<String> preventionRecommendations;
    private Map<String, Object> communityHealthMetrics;
    private List<String> riskFactors;

    // Inner class for health trends
    public static class HealthTrend {
        private String category;
        private String trend;
        private Double percentage;
        private String description;
        private String severity;

        public HealthTrend() {}

        public HealthTrend(String category, String trend, Double percentage, String description, String severity) {
            this.category = category;
            this.trend = trend;
            this.percentage = percentage;
            this.description = description;
            this.severity = severity;
        }

        // Getters and Setters
        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getTrend() {
            return trend;
        }

        public void setTrend(String trend) {
            this.trend = trend;
        }

        public Double getPercentage() {
            return percentage;
        }

        public void setPercentage(Double percentage) {
            this.percentage = percentage;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getSeverity() {
            return severity;
        }

        public void setSeverity(String severity) {
            this.severity = severity;
        }
    }

    // Inner class for disease patterns
    public static class DiseasePattern {
        private String diseaseName;
        private String pattern;
        private Integer frequency;
        private String seasonality;
        private List<String> affectedGroups;

        public DiseasePattern() {}

        public DiseasePattern(String diseaseName, String pattern, Integer frequency, 
                             String seasonality, List<String> affectedGroups) {
            this.diseaseName = diseaseName;
            this.pattern = pattern;
            this.frequency = frequency;
            this.seasonality = seasonality;
            this.affectedGroups = affectedGroups;
        }

        // Getters and Setters
        public String getDiseaseName() {
            return diseaseName;
        }

        public void setDiseaseName(String diseaseName) {
            this.diseaseName = diseaseName;
        }

        public String getPattern() {
            return pattern;
        }

        public void setPattern(String pattern) {
            this.pattern = pattern;
        }

        public Integer getFrequency() {
            return frequency;
        }

        public void setFrequency(Integer frequency) {
            this.frequency = frequency;
        }

        public String getSeasonality() {
            return seasonality;
        }

        public void setSeasonality(String seasonality) {
            this.seasonality = seasonality;
        }

        public List<String> getAffectedGroups() {
            return affectedGroups;
        }

        public void setAffectedGroups(List<String> affectedGroups) {
            this.affectedGroups = affectedGroups;
        }
    }

    // Constructors
    public HealthInsightsResponseDTO() {}

    public HealthInsightsResponseDTO(String insightType, List<HealthTrend> trends, 
                                   List<DiseasePattern> diseasePatterns, List<String> preventionRecommendations,
                                   Map<String, Object> communityHealthMetrics, List<String> riskFactors) {
        this.insightType = insightType;
        this.trends = trends;
        this.diseasePatterns = diseasePatterns;
        this.preventionRecommendations = preventionRecommendations;
        this.communityHealthMetrics = communityHealthMetrics;
        this.riskFactors = riskFactors;
    }

    // Getters and Setters
    public String getInsightType() {
        return insightType;
    }

    public void setInsightType(String insightType) {
        this.insightType = insightType;
    }

    public List<HealthTrend> getTrends() {
        return trends;
    }

    public void setTrends(List<HealthTrend> trends) {
        this.trends = trends;
    }

    public List<DiseasePattern> getDiseasePatterns() {
        return diseasePatterns;
    }

    public void setDiseasePatterns(List<DiseasePattern> diseasePatterns) {
        this.diseasePatterns = diseasePatterns;
    }

    public List<String> getPreventionRecommendations() {
        return preventionRecommendations;
    }

    public void setPreventionRecommendations(List<String> preventionRecommendations) {
        this.preventionRecommendations = preventionRecommendations;
    }

    public Map<String, Object> getCommunityHealthMetrics() {
        return communityHealthMetrics;
    }

    public void setCommunityHealthMetrics(Map<String, Object> communityHealthMetrics) {
        this.communityHealthMetrics = communityHealthMetrics;
    }

    public List<String> getRiskFactors() {
        return riskFactors;
    }

    public void setRiskFactors(List<String> riskFactors) {
        this.riskFactors = riskFactors;
    }
}
