package vn.project.ClinicSystem.model.dto;

import java.util.List;
import java.util.Map;

public class PredictiveAnalyticsResponseDTO {
    private String analysisType;
    private List<PredictionData> predictions;
    private Map<String, Object> trends;
    private List<String> recommendations;
    private String confidence;

    // Inner class for prediction data
    public static class PredictionData {
        private String period;
        private Double predictedValue;
        private Double actualValue;
        private String unit;
        private String description;

        public PredictionData() {}

        public PredictionData(String period, Double predictedValue, Double actualValue, 
                             String unit, String description) {
            this.period = period;
            this.predictedValue = predictedValue;
            this.actualValue = actualValue;
            this.unit = unit;
            this.description = description;
        }

        // Getters and Setters
        public String getPeriod() {
            return period;
        }

        public void setPeriod(String period) {
            this.period = period;
        }

        public Double getPredictedValue() {
            return predictedValue;
        }

        public void setPredictedValue(Double predictedValue) {
            this.predictedValue = predictedValue;
        }

        public Double getActualValue() {
            return actualValue;
        }

        public void setActualValue(Double actualValue) {
            this.actualValue = actualValue;
        }

        public String getUnit() {
            return unit;
        }

        public void setUnit(String unit) {
            this.unit = unit;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    // Constructors
    public PredictiveAnalyticsResponseDTO() {}

    public PredictiveAnalyticsResponseDTO(String analysisType, List<PredictionData> predictions, 
                                        Map<String, Object> trends, List<String> recommendations, String confidence) {
        this.analysisType = analysisType;
        this.predictions = predictions;
        this.trends = trends;
        this.recommendations = recommendations;
        this.confidence = confidence;
    }

    // Getters and Setters
    public String getAnalysisType() {
        return analysisType;
    }

    public void setAnalysisType(String analysisType) {
        this.analysisType = analysisType;
    }

    public List<PredictionData> getPredictions() {
        return predictions;
    }

    public void setPredictions(List<PredictionData> predictions) {
        this.predictions = predictions;
    }

    public Map<String, Object> getTrends() {
        return trends;
    }

    public void setTrends(Map<String, Object> trends) {
        this.trends = trends;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
    }

    public String getConfidence() {
        return confidence;
    }

    public void setConfidence(String confidence) {
        this.confidence = confidence;
    }
}
