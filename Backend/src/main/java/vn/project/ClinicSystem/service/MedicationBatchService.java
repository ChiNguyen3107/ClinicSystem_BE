package vn.project.ClinicSystem.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import jakarta.persistence.EntityNotFoundException;
import vn.project.ClinicSystem.model.Medication;
import vn.project.ClinicSystem.model.MedicationBatch;
import vn.project.ClinicSystem.model.dto.MedicationBatchAdjustRequest;
import vn.project.ClinicSystem.model.dto.MedicationBatchCreateRequest;
import vn.project.ClinicSystem.repository.MedicationBatchRepository;
import vn.project.ClinicSystem.repository.MedicationRepository;

@Service
@Transactional(readOnly = true)
public class MedicationBatchService {

    private final MedicationBatchRepository batchRepository;
    private final MedicationRepository medicationRepository;

    public MedicationBatchService(MedicationBatchRepository batchRepository,
            MedicationRepository medicationRepository) {
        this.batchRepository = batchRepository;
        this.medicationRepository = medicationRepository;
    }

    public MedicationBatch getById(Long id) {
        return batchRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy lô thuốc với id: " + id));
    }

    public List<MedicationBatch> listByMedication(Long medicationId) {
        return batchRepository.findByMedicationIdOrderByExpiryDateAsc(medicationId);
    }

    @Transactional
    public MedicationBatch create(MedicationBatchCreateRequest request) {
        Medication medication = loadMedication(request.getMedicationId());

        if (StringUtils.hasText(request.getBatchCode())) {
            batchRepository.findByMedicationIdAndBatchCode(medication.getId(), request.getBatchCode())
                    .ifPresent(existing -> {
                        throw new IllegalStateException("Đã tồn tại lô thuốc với mã: " + request.getBatchCode());
                    });
        }

        int unitsPerPackage = resolveUnitsPerPackage(request.getUnitsPerPackage());
        int packageCount = resolvePackageCount(request.getPackageCount());
        int totalUnits = resolveTotalUnits(request.getTotalUnits(), packageCount, unitsPerPackage);

        MedicationBatch batch = new MedicationBatch();
        batch.setMedication(medication);
        batch.setBatchCode(normalizeText(request.getBatchCode()));
        batch.setOrigin(normalizeText(request.getOrigin()));
        batch.setManufactureDate(request.getManufactureDate());
        batch.setExpiryDate(request.getExpiryDate());
        batch.setUnitPrice(normalizePrice(request.getUnitPrice()));
        batch.setPackageCount(packageCount);
        batch.setUnitsPerPackage(unitsPerPackage);
        batch.setQuantityOnHand(totalUnits);

        MedicationBatch saved = batchRepository.save(batch);
        increaseMedicationStock(medication, totalUnits);
        return saved;
    }

    @Transactional
    public MedicationBatch update(Long batchId, MedicationBatchAdjustRequest request) {
        MedicationBatch batch = getById(batchId);

        if (StringUtils.hasText(request.getBatchCode())) {
            batchRepository.findByMedicationIdAndBatchCode(batch.getMedication().getId(), request.getBatchCode())
                    .ifPresent(existing -> {
                        if (!existing.getId().equals(batchId)) {
                            throw new IllegalStateException("Đã tồn tại lô thuốc với mã: " + request.getBatchCode());
                        }
                    });
            batch.setBatchCode(normalizeText(request.getBatchCode()));
        }
        if (request.getOrigin() != null) {
            batch.setOrigin(normalizeText(request.getOrigin()));
        }
        if (request.getManufactureDate() != null) {
            batch.setManufactureDate(request.getManufactureDate());
        }
        if (request.getExpiryDate() != null) {
            batch.setExpiryDate(request.getExpiryDate());
        }
        if (request.getUnitPrice() != null) {
            batch.setUnitPrice(normalizePrice(request.getUnitPrice()));
        }
        Integer packageCount = request.getPackageCount();
        Integer unitsPerPackage = request.getUnitsPerPackage();
        Integer totalUnits = request.getTotalUnits();

        if (unitsPerPackage != null) {
            batch.setUnitsPerPackage(unitsPerPackage);
        }
        if (packageCount != null) {
            batch.setPackageCount(packageCount);
        }
        if (totalUnits == null && (packageCount != null || unitsPerPackage != null)) {
            int effectiveUnitsPerPackage = batch.getUnitsPerPackage() != null ? batch.getUnitsPerPackage() : 1;
            int effectivePackageCount = batch.getPackageCount() != null ? batch.getPackageCount() : 0;
            totalUnits = effectivePackageCount * effectiveUnitsPerPackage;
        }
        if (totalUnits != null) {
            int delta = totalUnits - batch.getQuantityOnHand();
            batch.setQuantityOnHand(totalUnits);
            adjustMedicationStock(batch.getMedication(), delta);
        }

        return batchRepository.save(batch);
    }

    @Transactional
    public void delete(Long batchId) {
        MedicationBatch batch = getById(batchId);
        if (batch.getQuantityOnHand() != null && batch.getQuantityOnHand() > 0) {
            adjustMedicationStock(batch.getMedication(), -batch.getQuantityOnHand());
        }
        batchRepository.delete(batch);
    }

    private void increaseMedicationStock(Medication medication, int amount) {
        adjustMedicationStock(medication, amount);
    }

    private void adjustMedicationStock(Medication medication, int delta) {
        if (delta == 0) {
            return;
        }
        int current = medication.getStockQuantity() != null ? medication.getStockQuantity() : 0;
        int updated = current + delta;
        if (updated < 0) {
            throw new IllegalStateException("Tồn kho thuốc không đủ.");
        }
        medication.setStockQuantity(updated);
        medicationRepository.save(medication);
    }

    private Medication loadMedication(Long id) {
        return medicationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thuốc với id: " + id));
    }

    private String normalizeText(String input) {
        if (!StringUtils.hasText(input)) {
            return null;
        }
        return input.trim();
    }

    private BigDecimal normalizePrice(BigDecimal price) {
        if (price == null) {
            return BigDecimal.ZERO;
        }
        return price.setScale(2, RoundingMode.HALF_UP);
    }

    private int resolveUnitsPerPackage(Integer unitsPerPackage) {
        if (unitsPerPackage == null || unitsPerPackage <= 0) {
            return 1;
        }
        return unitsPerPackage;
    }

    private int resolvePackageCount(Integer packageCount) {
        if (packageCount == null || packageCount < 0) {
            return 0;
        }
        return packageCount;
    }

    private int resolveTotalUnits(Integer totalUnits, int packageCount, int unitsPerPackage) {
        if (totalUnits != null && totalUnits > 0) {
            int derived = packageCount * unitsPerPackage;
            if (derived > 0 && derived != totalUnits) {
                throw new IllegalArgumentException("Tổng số đơn vị không khớp với số gói và số đơn vị mỗi gói.");
            }
            return totalUnits;
        }
        int derived = packageCount * unitsPerPackage;
        if (derived <= 0) {
            throw new IllegalArgumentException("Cần cung cấp tổng số đơn vị hoặc số gói và số đơn vị mỗi gói hợp lệ.");
        }
        return derived;
    }
}
