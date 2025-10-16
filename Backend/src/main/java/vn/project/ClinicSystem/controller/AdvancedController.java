package vn.project.ClinicSystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.project.ClinicSystem.model.RestResponse;
import vn.project.ClinicSystem.model.dto.*;
import vn.project.ClinicSystem.service.AdvancedService;
import vn.project.ClinicSystem.util.ResponseUtil;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/advanced")
@CrossOrigin(origins = "*")
public class AdvancedController {

    @Autowired
    private AdvancedService advancedService;

    /**
     * POST /advanced/ai-diagnosis - AI hỗ trợ chẩn đoán
     * Input: Triệu chứng, kết quả xét nghiệm
     * Output: Gợi ý chẩn đoán, độ tin cậy
     */
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    @PostMapping("/ai-diagnosis")
    public ResponseEntity<RestResponse<AIDiagnosisResponseDTO>> performAIDiagnosis(
            @Valid @RequestBody AIDiagnosisRequestDTO request) {
        try {
            AIDiagnosisResponseDTO response = advancedService.performAIDiagnosis(request);
            return ResponseUtil.success(response, "AI chẩn đoán thành công");
        } catch (Exception e) {
            return ResponseUtil.error("Lỗi khi thực hiện AI chẩn đoán: " + e.getMessage());
        }
    }

    /**
     * GET /advanced/medication-interactions - Kiểm tra tương tác thuốc
     * Input: Danh sách thuốc
     * Output: Cảnh báo tương tác
     */
    @PreAuthorize("hasRole('DOCTOR') or hasRole('PHARMACIST') or hasRole('ADMIN')")
    @PostMapping("/medication-interactions")
    public ResponseEntity<RestResponse<MedicationInteractionResponseDTO>> checkMedicationInteractions(
            @Valid @RequestBody MedicationInteractionDTO request) {
        try {
            MedicationInteractionResponseDTO response = advancedService.checkMedicationInteractions(request);
            return ResponseUtil.success(response, "Kiểm tra tương tác thuốc thành công");
        } catch (Exception e) {
            return ResponseUtil.error("Lỗi khi kiểm tra tương tác thuốc: " + e.getMessage());
        }
    }

    /**
     * POST /advanced/predictive-analytics - Phân tích dự đoán
     * Dự đoán xu hướng bệnh nhân, nhu cầu dịch vụ, doanh thu
     */
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @PostMapping("/predictive-analytics")
    public ResponseEntity<RestResponse<PredictiveAnalyticsResponseDTO>> performPredictiveAnalytics(
            @Valid @RequestBody PredictiveAnalyticsDTO request) {
        try {
            PredictiveAnalyticsResponseDTO response = advancedService.performPredictiveAnalytics(request);
            return ResponseUtil.success(response, "Phân tích dự đoán thành công");
        } catch (Exception e) {
            return ResponseUtil.error("Lỗi khi thực hiện phân tích dự đoán: " + e.getMessage());
        }
    }

    /**
     * GET /advanced/health-insights - Thông tin sức khỏe
     * Phân tích sức khỏe cộng đồng, xu hướng bệnh tật, khuyến nghị phòng ngừa
     */
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('DOCTOR')")
    @PostMapping("/health-insights")
    public ResponseEntity<RestResponse<HealthInsightsResponseDTO>> getHealthInsights(
            @Valid @RequestBody HealthInsightsDTO request) {
        try {
            HealthInsightsResponseDTO response = advancedService.getHealthInsights(request);
            return ResponseUtil.success(response, "Lấy thông tin sức khỏe thành công");
        } catch (Exception e) {
            return ResponseUtil.error("Lỗi khi lấy thông tin sức khỏe: " + e.getMessage());
        }
    }

    /**
     * GET /advanced/ai-diagnosis/symptoms - Lấy danh sách triệu chứng phổ biến
     */
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    @GetMapping("/ai-diagnosis/symptoms")
    public ResponseEntity<RestResponse<List<String>>> getCommonSymptoms() {
        try {
            List<String> symptoms = List.of(
                "Sốt", "Ho", "Đau đầu", "Buồn nôn", "Đau bụng", "Khó thở", 
                "Đau ngực", "Chóng mặt", "Mệt mỏi", "Đau cơ", "Đau khớp"
            );
            return ResponseUtil.success(symptoms, "Lấy danh sách triệu chứng thành công");
        } catch (Exception e) {
            return ResponseUtil.error("Lỗi khi lấy danh sách triệu chứng: " + e.getMessage());
        }
    }

    /**
     * GET /advanced/medication-interactions/drugs - Lấy danh sách thuốc phổ biến
     */
    @PreAuthorize("hasRole('DOCTOR') or hasRole('PHARMACIST') or hasRole('ADMIN')")
    @GetMapping("/medication-interactions/drugs")
    public ResponseEntity<RestResponse<List<String>>> getCommonMedications() {
        try {
            List<String> medications = List.of(
                "Aspirin", "Warfarin", "Digoxin", "Furosemide", "Metformin", 
                "Lisinopril", "Amlodipine", "Omeprazole", "Atorvastatin", "Metoprolol"
            );
            return ResponseUtil.success(medications, "Lấy danh sách thuốc thành công");
        } catch (Exception e) {
            return ResponseUtil.error("Lỗi khi lấy danh sách thuốc: " + e.getMessage());
        }
    }

    /**
     * GET /advanced/analytics/types - Lấy danh sách loại phân tích
     */
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @GetMapping("/analytics/types")
    public ResponseEntity<RestResponse<List<String>>> getAnalyticsTypes() {
        try {
            List<String> types = List.of(
                "patient_trends", "service_demand", "revenue", "disease_patterns", 
                "resource_utilization", "cost_analysis"
            );
            return ResponseUtil.success(types, "Lấy danh sách loại phân tích thành công");
        } catch (Exception e) {
            return ResponseUtil.error("Lỗi khi lấy danh sách loại phân tích: " + e.getMessage());
        }
    }

    /**
     * GET /advanced/health-insights/types - Lấy danh sách loại thông tin sức khỏe
     */
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('DOCTOR')")
    @GetMapping("/health-insights/types")
    public ResponseEntity<RestResponse<List<String>>> getHealthInsightTypes() {
        try {
            List<String> types = List.of(
                "community_health", "disease_trends", "prevention", "epidemiology", 
                "public_health", "health_education"
            );
            return ResponseUtil.success(types, "Lấy danh sách loại thông tin sức khỏe thành công");
        } catch (Exception e) {
            return ResponseUtil.error("Lỗi khi lấy danh sách loại thông tin sức khỏe: " + e.getMessage());
        }
    }
}
