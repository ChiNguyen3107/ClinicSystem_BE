package vn.project.ClinicSystem.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import vn.project.ClinicSystem.model.MedicalService;
import vn.project.ClinicSystem.model.ServiceIndicator;
import vn.project.ClinicSystem.model.dto.ServiceIndicatorCreateRequest;
import vn.project.ClinicSystem.model.dto.ServiceIndicatorUpdateRequest;
import vn.project.ClinicSystem.repository.MedicalServiceRepository;
import vn.project.ClinicSystem.repository.ServiceIndicatorRepository;

@Service
@Transactional(readOnly = true)
public class ServiceIndicatorService {

    private final ServiceIndicatorRepository indicatorRepository;
    private final MedicalServiceRepository medicalServiceRepository;
    private final Validator validator;

    public ServiceIndicatorService(ServiceIndicatorRepository indicatorRepository,
            MedicalServiceRepository medicalServiceRepository,
            Validator validator) {
        this.indicatorRepository = indicatorRepository;
        this.medicalServiceRepository = medicalServiceRepository;
        this.validator = validator;
    }

    public ServiceIndicator getById(Long id) {
        return indicatorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy chỉ số với id: " + id));
    }

    public List<ServiceIndicator> listByMedicalService(Long medicalServiceId) {
        ensureServiceExists(medicalServiceId);
        return indicatorRepository.findByMedicalServiceIdOrderByNameAsc(medicalServiceId);
    }

    @Transactional
    public ServiceIndicator create(Long medicalServiceId, ServiceIndicatorCreateRequest request) {
        MedicalService service = loadService(medicalServiceId);

        ServiceIndicator indicator = new ServiceIndicator();
        indicator.setMedicalService(service);
        indicator.setCode(normalizeCode(request.getCode()));
        indicator.setName(normalizeText(request.getName(), "Tên chỉ số không hợp lệ"));
        indicator.setUnit(normalizeOptional(request.getUnit()));
        indicator.setNormalMin(request.getNormalMin());
        indicator.setNormalMax(request.getNormalMax());
        indicator.setCriticalMin(request.getCriticalMin());
        indicator.setCriticalMax(request.getCriticalMax());
        indicator.setReferenceNote(normalizeOptional(request.getReferenceNote()));
        indicator.setRequired(request.getRequired() == null || Boolean.TRUE.equals(request.getRequired()));

        ensureCodeUnique(service.getId(), indicator.getCode(), null);
        validateBean(indicator);
        return indicatorRepository.save(indicator);
    }

    @Transactional
    public ServiceIndicator update(Long id, ServiceIndicatorUpdateRequest request) {
        ServiceIndicator indicator = getById(id);

        if (request.getCode() != null) {
            String normalized = normalizeCode(request.getCode());
            if (!normalized.equalsIgnoreCase(indicator.getCode())) {
                ensureCodeUnique(indicator.getMedicalService().getId(), normalized, indicator.getId());
            }
            indicator.setCode(normalized);
        }

        if (request.getName() != null) {
            indicator.setName(normalizeText(request.getName(), "Tên chỉ số không hợp lệ"));
        }
        if (request.getUnit() != null) {
            indicator.setUnit(normalizeOptional(request.getUnit()));
        }
        if (request.getNormalMin() != null || request.getNormalMax() != null) {
            indicator.setNormalMin(request.getNormalMin());
            indicator.setNormalMax(request.getNormalMax());
        }
        if (request.getCriticalMin() != null || request.getCriticalMax() != null) {
            indicator.setCriticalMin(request.getCriticalMin());
            indicator.setCriticalMax(request.getCriticalMax());
        }
        if (request.getReferenceNote() != null) {
            indicator.setReferenceNote(normalizeOptional(request.getReferenceNote()));
        }
        if (request.getRequired() != null) {
            indicator.setRequired(Boolean.TRUE.equals(request.getRequired()));
        }

        validateBean(indicator);
        return indicatorRepository.save(indicator);
    }

    @Transactional
    public void delete(Long id) {
        if (!indicatorRepository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy chỉ số với id: " + id);
        }
        indicatorRepository.deleteById(id);
    }

    private void ensureServiceExists(Long serviceId) {
        if (!medicalServiceRepository.existsById(serviceId)) {
            throw new EntityNotFoundException("Không tìm thấy dịch vụ với id: " + serviceId);
        }
    }

    private MedicalService loadService(Long serviceId) {
        return medicalServiceRepository.findById(serviceId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy dịch vụ với id: " + serviceId));
    }

    private void ensureCodeUnique(Long serviceId, String code, Long currentId) {
        indicatorRepository.findByMedicalServiceIdAndCodeIgnoreCase(serviceId, code)
                .ifPresent(existing -> {
                    boolean same = currentId != null && existing.getId().equals(currentId);
                    if (!same) {
                        throw new EntityExistsException("Đã tồn tại chỉ số với mã: " + code);
                    }
                });
    }

    private void validateBean(ServiceIndicator indicator) {
        var violations = validator.validate(indicator);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }
    }

    private String normalizeCode(String code) {
        if (!StringUtils.hasText(code)) {
            throw new IllegalArgumentException("Mã chỉ số không được để trống");
        }
        return code.trim().toUpperCase();
    }

    private String normalizeText(String value, String message) {
        if (!StringUtils.hasText(value)) {
            throw new IllegalArgumentException(message);
        }
        return value.trim();
    }

    private String normalizeOptional(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}
