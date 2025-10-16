package vn.project.ClinicSystem.service;

import org.springframework.stereotype.Service;
import vn.project.ClinicSystem.model.dto.*;

import java.util.*;

@Service
public class AdvancedService {

    /**
     * AI hỗ trợ chẩn đoán dựa trên triệu chứng và kết quả xét nghiệm
     */
    public AIDiagnosisResponseDTO performAIDiagnosis(AIDiagnosisRequestDTO request) {
        // Simulate AI diagnosis logic
        List<String> suggestedDiagnoses = new ArrayList<>();
        List<Double> confidenceScores = new ArrayList<>();
        
        // Basic symptom analysis
        String symptoms = request.getSymptoms().toLowerCase();
        
        if (symptoms.contains("sốt") && symptoms.contains("ho")) {
            suggestedDiagnoses.add("Cảm cúm");
            suggestedDiagnoses.add("Viêm phế quản");
            confidenceScores.add(0.85);
            confidenceScores.add(0.70);
        } else if (symptoms.contains("đau đầu") && symptoms.contains("buồn nôn")) {
            suggestedDiagnoses.add("Đau nửa đầu");
            suggestedDiagnoses.add("Tăng huyết áp");
            confidenceScores.add(0.80);
            confidenceScores.add(0.65);
        } else if (symptoms.contains("đau bụng") && symptoms.contains("nôn")) {
            suggestedDiagnoses.add("Viêm dạ dày");
            suggestedDiagnoses.add("Ngộ độc thực phẩm");
            confidenceScores.add(0.75);
            confidenceScores.add(0.60);
        } else {
            suggestedDiagnoses.add("Cần khám thêm");
            confidenceScores.add(0.50);
        }

        String recommendation = "Khuyến nghị khám bác sĩ chuyên khoa để xác định chính xác";
        String severity = confidenceScores.get(0) > 0.8 ? "Cao" : "Trung bình";
        
        List<String> suggestedTests = Arrays.asList("Xét nghiệm máu", "Xét nghiệm nước tiểu", "Chụp X-quang");

        return new AIDiagnosisResponseDTO(suggestedDiagnoses, confidenceScores, 
                                         recommendation, severity, suggestedTests);
    }

    /**
     * Kiểm tra tương tác thuốc
     */
    public MedicationInteractionResponseDTO checkMedicationInteractions(MedicationInteractionDTO request) {
        List<MedicationInteractionResponseDTO.InteractionWarning> interactions = new ArrayList<>();
        List<String> medications = request.getMedications();
        
        // Simulate drug interaction checking
        for (int i = 0; i < medications.size(); i++) {
            for (int j = i + 1; j < medications.size(); j++) {
                String med1 = medications.get(i);
                String med2 = medications.get(j);
                
                // Simulate known interactions
                if ((med1.toLowerCase().contains("warfarin") && med2.toLowerCase().contains("aspirin")) ||
                    (med1.toLowerCase().contains("aspirin") && med2.toLowerCase().contains("warfarin"))) {
                    interactions.add(new MedicationInteractionResponseDTO.InteractionWarning(
                        med1, med2, "Cao", 
                        "Tăng nguy cơ chảy máu", 
                        "Theo dõi chặt chẽ thời gian đông máu"
                    ));
                } else if ((med1.toLowerCase().contains("digoxin") && med2.toLowerCase().contains("furosemide")) ||
                          (med1.toLowerCase().contains("furosemide") && med2.toLowerCase().contains("digoxin"))) {
                    interactions.add(new MedicationInteractionResponseDTO.InteractionWarning(
                        med1, med2, "Trung bình", 
                        "Có thể gây rối loạn điện giải", 
                        "Theo dõi nồng độ kali và digoxin"
                    ));
                }
            }
        }

        String overallRisk = interactions.isEmpty() ? "Thấp" : 
                            interactions.stream().anyMatch(i -> i.getSeverity().equals("Cao")) ? "Cao" : "Trung bình";
        
        List<String> recommendations = Arrays.asList(
            "Theo dõi chặt chẽ các dấu hiệu bất thường",
            "Thông báo cho bác sĩ nếu có tác dụng phụ",
            "Không tự ý thay đổi liều lượng"
        );

        return new MedicationInteractionResponseDTO(interactions, overallRisk, 
                                                   recommendations, !interactions.isEmpty());
    }

    /**
     * Phân tích dự đoán
     */
    public PredictiveAnalyticsResponseDTO performPredictiveAnalytics(PredictiveAnalyticsDTO request) {
        List<PredictiveAnalyticsResponseDTO.PredictionData> predictions = new ArrayList<>();
        Map<String, Object> trends = new HashMap<>();
        List<String> recommendations = new ArrayList<>();

        String analysisType = request.getAnalysisType();
        
        if ("patient_trends".equals(analysisType)) {
            // Simulate patient trend predictions
            predictions.add(new PredictiveAnalyticsResponseDTO.PredictionData(
                "Tháng tới", 150.0, null, "bệnh nhân", "Dự đoán số lượng bệnh nhân mới"
            ));
            predictions.add(new PredictiveAnalyticsResponseDTO.PredictionData(
                "Quý tới", 450.0, null, "bệnh nhân", "Dự đoán tổng số bệnh nhân trong quý"
            ));
            
            trends.put("tăng_trưởng", "15%");
            trends.put("xu_hướng", "Tăng dần");
            
            recommendations.add("Tăng cường nhân lực y tế");
            recommendations.add("Mở rộng cơ sở vật chất");
            
        } else if ("service_demand".equals(analysisType)) {
            // Simulate service demand predictions
            predictions.add(new PredictiveAnalyticsResponseDTO.PredictionData(
                "Tháng tới", 200.0, null, "cuộc hẹn", "Dự đoán nhu cầu dịch vụ"
            ));
            
            trends.put("dịch_vụ_phổ_biến", "Khám tim mạch");
            trends.put("thời_điểm_đỉnh", "8h-10h sáng");
            
            recommendations.add("Tăng số lượng bác sĩ tim mạch");
            recommendations.add("Mở thêm ca khám sáng sớm");
            
        } else if ("revenue".equals(analysisType)) {
            // Simulate revenue predictions
            predictions.add(new PredictiveAnalyticsResponseDTO.PredictionData(
                "Tháng tới", 50000000.0, null, "VND", "Dự đoán doanh thu"
            ));
            predictions.add(new PredictiveAnalyticsResponseDTO.PredictionData(
                "Quý tới", 150000000.0, null, "VND", "Dự đoán doanh thu quý"
            ));
            
            trends.put("tăng_trưởng_doanh_thu", "12%");
            trends.put("nguồn_doanh_thu_chính", "Khám bệnh và xét nghiệm");
            
            recommendations.add("Tối ưu hóa giá dịch vụ");
            recommendations.add("Phát triển dịch vụ cao cấp");
        }

        String confidence = "85%";

        return new PredictiveAnalyticsResponseDTO(analysisType, predictions, trends, 
                                                recommendations, confidence);
    }

    /**
     * Lấy thông tin sức khỏe cộng đồng
     */
    public HealthInsightsResponseDTO getHealthInsights(HealthInsightsDTO request) {
        List<HealthInsightsResponseDTO.HealthTrend> trends = new ArrayList<>();
        List<HealthInsightsResponseDTO.DiseasePattern> diseasePatterns = new ArrayList<>();
        List<String> preventionRecommendations = new ArrayList<>();
        Map<String, Object> communityHealthMetrics = new HashMap<>();
        List<String> riskFactors = new ArrayList<>();

        String insightType = request.getInsightType();
        
        if ("community_health".equals(insightType)) {
            // Community health analysis
            trends.add(new HealthInsightsResponseDTO.HealthTrend(
                "Sức khỏe tim mạch", "Cải thiện", 15.5, 
                "Tỷ lệ bệnh tim mạch giảm", "Thấp"
            ));
            trends.add(new HealthInsightsResponseDTO.HealthTrend(
                "Bệnh tiểu đường", "Tăng", 8.2, 
                "Tỷ lệ tiểu đường tăng nhẹ", "Trung bình"
            ));
            
            communityHealthMetrics.put("tuổi_thọ_trung_bình", "75.2 tuổi");
            communityHealthMetrics.put("tỷ_lệ_tử_vong_trẻ_em", "0.8%");
            communityHealthMetrics.put("tỷ_lệ_sinh_an_toàn", "98.5%");
            
        } else if ("disease_trends".equals(insightType)) {
            // Disease trend analysis
            diseasePatterns.add(new HealthInsightsResponseDTO.DiseasePattern(
                "Cảm cúm", "Tăng vào mùa đông", 45, 
                "Tháng 11-2", Arrays.asList("Trẻ em", "Người già")
            ));
            diseasePatterns.add(new HealthInsightsResponseDTO.DiseasePattern(
                "Dị ứng", "Tăng vào mùa xuân", 32, 
                "Tháng 3-5", Arrays.asList("Trẻ em", "Thanh niên")
            ));
            
        } else if ("prevention".equals(insightType)) {
            // Prevention recommendations
            preventionRecommendations.add("Tiêm phòng cúm hàng năm");
            preventionRecommendations.add("Tập thể dục thường xuyên");
            preventionRecommendations.add("Ăn uống lành mạnh");
            preventionRecommendations.add("Khám sức khỏe định kỳ");
        }

        riskFactors.add("Hút thuốc lá");
        riskFactors.add("Uống rượu bia");
        riskFactors.add("Ít vận động");
        riskFactors.add("Chế độ ăn không lành mạnh");

        return new HealthInsightsResponseDTO(insightType, trends, diseasePatterns, 
                                           preventionRecommendations, communityHealthMetrics, riskFactors);
    }
}
