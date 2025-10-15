package vn.project.ClinicSystem.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import vn.project.ClinicSystem.model.Medication;
import vn.project.ClinicSystem.model.dto.MedicationCreateRequest;
import vn.project.ClinicSystem.model.dto.MedicationUpdateRequest;
import vn.project.ClinicSystem.repository.MedicationRepository;

@Service
@Transactional(readOnly = true)
public class MedicationService {

    private final MedicationRepository medicationRepository;
    private final Validator validator;

    public MedicationService(MedicationRepository medicationRepository, Validator validator) {
        this.medicationRepository = medicationRepository;
        this.validator = validator;
    }

    public List<Medication> findAll() {
        return medicationRepository.findAll();
    }

    public Medication getById(Long id) {
        return medicationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thuốc với id: " + id));
    }

    @Transactional
    public Medication create(MedicationCreateRequest request) {
        Medication medication = new Medication();
        medication.setName(normalizeName(request.getName()));
        medication.setActiveIngredient(normalizeText(request.getActiveIngredient()));
        medication.setForm(normalizeText(request.getForm()));
        medication.setUnit(normalizeText(request.getUnit()));
        medication.setStockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0);

        ensureNameUnique(medication.getName(), null);
        validateBean(medication);
        return medicationRepository.save(medication);
    }

    @Transactional
    public Medication update(Long id, MedicationUpdateRequest request) {
        Medication medication = getById(id);

        if (request.getName() != null) {
            String normalized = normalizeName(request.getName());
            if (!normalized.equalsIgnoreCase(medication.getName())) {
                ensureNameUnique(normalized, medication.getId());
            }
            medication.setName(normalized);
        }
        if (request.getActiveIngredient() != null) {
            medication.setActiveIngredient(normalizeText(request.getActiveIngredient()));
        }
        if (request.getForm() != null) {
            medication.setForm(normalizeText(request.getForm()));
        }
        if (request.getUnit() != null) {
            medication.setUnit(normalizeText(request.getUnit()));
        }
        if (request.getStockQuantity() != null) {
            if (request.getStockQuantity() < 0) {
                throw new IllegalArgumentException("Tồn kho phải >= 0");
            }
            medication.setStockQuantity(request.getStockQuantity());
        }

        validateBean(medication);
        return medicationRepository.save(medication);
    }

    @Transactional
    public void delete(Long id) {
        Medication medication = getById(id);
        if (medication.getPrescriptionItems() != null && !medication.getPrescriptionItems().isEmpty()) {
            throw new IllegalStateException("Không thể xóa thuốc đã được kê trong đơn thuốc.");
        }
        if (medication.getBatches() != null && !medication.getBatches().isEmpty()) {
            throw new IllegalStateException("Không thể xóa thuốc khi vẫn còn lô trong kho.");
        }
        medicationRepository.delete(medication);
    }

    private void ensureNameUnique(String name, Long currentMedicationId) {
        medicationRepository.findByNameIgnoreCase(name).ifPresent(existing -> {
            boolean same = currentMedicationId != null && existing.getId().equals(currentMedicationId);
            if (!same) {
                throw new EntityExistsException("Đã tồn tại thuốc với tên: " + name);
            }
        });
    }

    private void validateBean(Medication medication) {
        var violations = validator.validate(medication);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }
    }

    private String normalizeName(String input) {
        if (!StringUtils.hasText(input)) {
            throw new IllegalArgumentException("Tên thuốc không được để trống");
        }
        return input.trim();
    }

    private String normalizeText(String input) {
        if (!StringUtils.hasText(input)) {
            return null;
        }
        return input.trim();
    }
}
