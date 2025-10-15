package vn.project.ClinicSystem.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import vn.project.ClinicSystem.model.Doctor;
import vn.project.ClinicSystem.model.MedicalService;
import vn.project.ClinicSystem.model.ServiceIndicator;
import vn.project.ClinicSystem.model.ServiceOrder;
import vn.project.ClinicSystem.model.ServiceOrderResult;
import vn.project.ClinicSystem.model.dto.ServiceOrderResultEntryRequest;
import vn.project.ClinicSystem.model.dto.ServiceOrderResultRequest;
import vn.project.ClinicSystem.model.enums.IndicatorResultLevel;
import vn.project.ClinicSystem.model.enums.ServiceOrderStatus;
import vn.project.ClinicSystem.repository.DoctorRepository;
import vn.project.ClinicSystem.repository.ServiceIndicatorRepository;
import vn.project.ClinicSystem.repository.ServiceOrderRepository;
import vn.project.ClinicSystem.repository.ServiceOrderResultRepository;

@Service
@Transactional(readOnly = true)
public class ServiceOrderResultService {

    private final ServiceOrderRepository serviceOrderRepository;
    private final ServiceIndicatorRepository indicatorRepository;
    private final ServiceOrderResultRepository resultRepository;
    private final DoctorRepository doctorRepository;

    public ServiceOrderResultService(ServiceOrderRepository serviceOrderRepository,
            ServiceIndicatorRepository indicatorRepository,
            ServiceOrderResultRepository resultRepository,
            DoctorRepository doctorRepository) {
        this.serviceOrderRepository = serviceOrderRepository;
        this.indicatorRepository = indicatorRepository;
        this.resultRepository = resultRepository;
        this.doctorRepository = doctorRepository;
    }

    public List<ServiceOrderResult> findResults(Long serviceOrderId) {
        ensureOrderExists(serviceOrderId);
        return resultRepository.findByServiceOrderIdOrderByIdAsc(serviceOrderId);
    }

    @Transactional
    public ServiceOrder recordResults(Long serviceOrderId, ServiceOrderResultRequest request) {
        ServiceOrder order = loadOrder(serviceOrderId);
        MedicalService medicalService = order.getMedicalService();

        if (order.getStatus() == ServiceOrderStatus.CANCELLED) {
            throw new IllegalStateException("Không thể nhập kết quả cho phiếu dịch vụ đã hủy.");
        }

        Map<Long, ServiceIndicator> indicatorsById = loadIndicatorsMap(medicalService.getId(), request.getIndicators());
        ensureRequiredIndicatorsFilled(medicalService.getId(), request.getIndicators());

        order.clearIndicatorResults();
        request.getIndicators().forEach(entry -> {
            ServiceIndicator indicator = indicatorsById.get(entry.getIndicatorId());
            ServiceOrderResult result = buildResult(indicator, entry);
            order.addIndicatorResult(result);
        });

        if (request.getOverallConclusion() != null) {
            order.setResultNote(request.getOverallConclusion().trim());
        }

        if (request.getPerformedById() != null) {
            order.setPerformedBy(loadDoctor(request.getPerformedById()));
        } else if (order.getPerformedBy() == null) {
            order.setPerformedBy(order.getAssignedDoctor());
        }

        order.setPerformedAt(request.getPerformedAt() != null ? request.getPerformedAt() : LocalDateTime.now());
        order.setStatus(ServiceOrderStatus.COMPLETED_WITH_RESULT);

        return serviceOrderRepository.save(order);
    }

    private ServiceOrderResult buildResult(ServiceIndicator indicator, ServiceOrderResultEntryRequest entry) {
        ServiceOrderResult result = new ServiceOrderResult();
        result.setIndicator(indicator);
        result.setIndicatorNameSnapshot(indicator.getName());
        result.setUnitSnapshot(indicator.getUnit());
        result.setMeasuredValue(entry.getValue().stripTrailingZeros());
        result.setEvaluation(evaluate(indicator, entry.getValue()));
        result.setNote(entry.getNote() != null ? entry.getNote().trim() : null);
        return result;
    }

    private Map<Long, ServiceIndicator> loadIndicatorsMap(Long medicalServiceId,
            List<ServiceOrderResultEntryRequest> entries) {
        Set<Long> indicatorIds = new HashSet<>();
        for (ServiceOrderResultEntryRequest entry : entries) {
            if (!indicatorIds.add(entry.getIndicatorId())) {
                throw new IllegalArgumentException("Không được nhập trùng một chỉ số hai lần.");
            }
        }

        Map<Long, ServiceIndicator> map = new HashMap<>();
        for (Long id : indicatorIds) {
            ServiceIndicator indicator = indicatorRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy chỉ số với id: " + id));
            if (!indicator.getMedicalService().getId().equals(medicalServiceId)) {
                throw new IllegalArgumentException("Chỉ số " + indicator.getCode()
                        + " không thuộc dịch vụ có id: " + medicalServiceId);
            }
            map.put(id, indicator);
        }
        return map;
    }

    private void ensureRequiredIndicatorsFilled(Long serviceId, List<ServiceOrderResultEntryRequest> entries) {
        List<ServiceIndicator> requiredIndicators = indicatorRepository.findByMedicalServiceIdAndRequiredTrue(serviceId);
        if (requiredIndicators.isEmpty()) {
            return;
        }
        Set<Long> provided = new HashSet<>();
        entries.forEach(entry -> provided.add(entry.getIndicatorId()));

        for (ServiceIndicator indicator : requiredIndicators) {
            if (!provided.contains(indicator.getId())) {
                throw new IllegalArgumentException(
                        "Thiếu kết quả cho chỉ số bắt buộc: " + indicator.getName());
            }
        }
    }

    private IndicatorResultLevel evaluate(ServiceIndicator indicator, BigDecimal value) {
        BigDecimal min = indicator.getNormalMin();
        BigDecimal max = indicator.getNormalMax();

        if (min != null && value.compareTo(min) < 0) {
            return IndicatorResultLevel.LOW;
        }
        if (max != null && value.compareTo(max) > 0) {
            return IndicatorResultLevel.HIGH;
        }
        if (min == null && max == null) {
            return IndicatorResultLevel.UNKNOWN;
        }
        return IndicatorResultLevel.NORMAL;
    }

    private ServiceOrder loadOrder(Long id) {
        return serviceOrderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phiếu dịch vụ với id: " + id));
    }

    private void ensureOrderExists(Long id) {
        if (!serviceOrderRepository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy phiếu dịch vụ với id: " + id);
        }
    }

    private Doctor loadDoctor(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bác sĩ với id: " + id));
    }
}
