package vn.project.ClinicSystem.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import vn.project.ClinicSystem.model.Doctor;
import vn.project.ClinicSystem.model.Medication;
import vn.project.ClinicSystem.model.MedicationBatch;
import vn.project.ClinicSystem.model.PatientVisit;
import vn.project.ClinicSystem.model.Prescription;
import vn.project.ClinicSystem.model.PrescriptionItem;
import vn.project.ClinicSystem.model.ServiceOrder;
import vn.project.ClinicSystem.model.dto.PrescriptionCreateRequest;
import vn.project.ClinicSystem.model.dto.PrescriptionItemRequest;
import vn.project.ClinicSystem.model.dto.PrescriptionUpdateRequest;
import vn.project.ClinicSystem.model.enums.ServiceOrderStatus;
import vn.project.ClinicSystem.model.enums.VisitStatus;
import vn.project.ClinicSystem.repository.DoctorRepository;
import vn.project.ClinicSystem.repository.MedicationBatchRepository;
import vn.project.ClinicSystem.repository.MedicationRepository;
import vn.project.ClinicSystem.repository.PatientVisitRepository;
import vn.project.ClinicSystem.repository.PrescriptionRepository;
import vn.project.ClinicSystem.repository.ServiceIndicatorRepository;
import vn.project.ClinicSystem.repository.ServiceOrderRepository;

@Service
@Transactional(readOnly = true)
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientVisitRepository patientVisitRepository;
    private final DoctorRepository doctorRepository;
    private final MedicationRepository medicationRepository;
    private final MedicationBatchRepository medicationBatchRepository;
    private final ServiceOrderRepository serviceOrderRepository;
    private final ServiceIndicatorRepository serviceIndicatorRepository;
    private final Validator validator;

    public PrescriptionService(PrescriptionRepository prescriptionRepository,
            PatientVisitRepository patientVisitRepository,
            DoctorRepository doctorRepository,
            MedicationRepository medicationRepository,
            MedicationBatchRepository medicationBatchRepository,
            ServiceOrderRepository serviceOrderRepository,
            ServiceIndicatorRepository serviceIndicatorRepository,
            Validator validator) {
        this.prescriptionRepository = prescriptionRepository;
        this.patientVisitRepository = patientVisitRepository;
        this.doctorRepository = doctorRepository;
        this.medicationRepository = medicationRepository;
        this.medicationBatchRepository = medicationBatchRepository;
        this.serviceOrderRepository = serviceOrderRepository;
        this.serviceIndicatorRepository = serviceIndicatorRepository;
        this.validator = validator;
    }

    public Prescription getById(Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn thuốc với id: " + id));
        hydratePrescription(prescription);
        return prescription;
    }

    public List<Prescription> findAll() {
        List<Prescription> prescriptions = prescriptionRepository.findAll();
        prescriptions.forEach(this::hydratePrescription);
        return prescriptions;
    }

    public List<Prescription> findByVisit(Long visitId) {
        ensureVisitExists(visitId);
        List<Prescription> prescriptions = prescriptionRepository.findByVisitIdOrderByIssuedAtDesc(visitId);
        prescriptions.forEach(this::hydratePrescription);
        return prescriptions;
    }

    @Transactional
    public Prescription create(PrescriptionCreateRequest request) {
        PatientVisit visit = loadVisit(request.getVisitId());

        if (visit.getStatus() == VisitStatus.CANCELLED) {
            throw new IllegalStateException("Không thể tạo đơn thuốc cho hồ sơ đã hủy.");
        }

        ensureServiceOrdersReadyForPrescription(visit.getId());

        Prescription prescription = new Prescription();
        prescription.setVisit(visit);
        prescription.setNotes(normalizeText(request.getNotes()));
        prescription.setIssuedAt(resolveIssuedAt(request.getIssuedAt()));

        if (request.getPrescribedById() != null) {
            prescription.setPrescribedBy(loadDoctor(request.getPrescribedById()));
        } else if (visit.getPrimaryAppointment() != null && visit.getPrimaryAppointment().getDoctor() != null) {
            prescription.setPrescribedBy(visit.getPrimaryAppointment().getDoctor());
        }

        applyItems(prescription, request.getItems());
        validateBean(prescription);
        Prescription saved = prescriptionRepository.save(prescription);
        hydratePrescription(saved);
        return saved;
    }

    @Transactional
    public Prescription update(Long id, PrescriptionUpdateRequest request) {
        Prescription prescription = getById(id);

        if (request.getIssuedAt() != null) {
            prescription.setIssuedAt(request.getIssuedAt());
        }
        if (request.getNotes() != null) {
            prescription.setNotes(normalizeText(request.getNotes()));
        }
        if (Boolean.TRUE.equals(request.getClearPrescribedBy())) {
            prescription.setPrescribedBy(null);
        } else if (request.getPrescribedById() != null) {
            prescription.setPrescribedBy(loadDoctor(request.getPrescribedById()));
        }
        if (request.getItems() != null) {
            if (request.getItems().isEmpty()) {
                throw new IllegalArgumentException("Đơn thuốc phải có ít nhất 1 thuốc");
            }
            applyItems(prescription, request.getItems());
        }

        validateBean(prescription);
        Prescription saved = prescriptionRepository.save(prescription);
        hydratePrescription(saved);
        return saved;
    }

    @Transactional
    public void delete(Long id) {
        if (!prescriptionRepository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy đơn thuốc với id: " + id);
        }
        prescriptionRepository.deleteById(id);
    }

    private void applyItems(Prescription prescription, List<PrescriptionItemRequest> itemRequests) {
        prescription.getItems().forEach(this::returnStockForItem);
        prescription.clearItems();

        for (PrescriptionItemRequest itemRequest : itemRequests) {
            PrescriptionItem item = new PrescriptionItem();
            Medication medication = null;
            MedicationBatch batch = null;

            if (itemRequest.getBatchId() != null) {
                batch = loadBatch(itemRequest.getBatchId());
                medication = batch.getMedication();
                item.setMedicationBatch(batch);
                item.setMedication(medication);
            }

            if (itemRequest.getMedicationId() != null) {
                Medication loaded = loadMedication(itemRequest.getMedicationId());
                if (medication != null && !loaded.getId().equals(medication.getId())) {
                    throw new IllegalArgumentException("Lô thuốc không trùng với thuốc đã chọn.");
                }
                medication = loaded;
                medication = loadMedication(itemRequest.getMedicationId());
                item.setMedication(medication);
                item.setMedicationBatch(batch);
            }

            String medicationName = normalizeText(itemRequest.getMedicationName());
            if (medication == null && !StringUtils.hasText(medicationName)) {
                throw new IllegalArgumentException("Cần nhập tên thuốc khi không chọn thuốc có sẵn");
            }
            if (medication != null && !StringUtils.hasText(medicationName)) {
                medicationName = medication.getName();
            }

            item.setMedicationName(medicationName);
            item.setDosage(requireText(itemRequest.getDosage(), "Liều dùng không được để trống"));
            item.setFrequency(requireText(itemRequest.getFrequency(), "Tần suất không được để trống"));
            item.setDuration(normalizeText(itemRequest.getDuration()));
            item.setInstruction(normalizeText(itemRequest.getInstruction()));

            Integer quantity = itemRequest.getQuantity();
            if (quantity == null || quantity <= 0) {
                throw new IllegalArgumentException("Cần nhập số lượng thuốc hợp lệ");
            }
            item.setQuantity(quantity);

            BigDecimal unitPrice = BigDecimal.ZERO;
            if (batch != null) {
                if (batch.getQuantityOnHand() < quantity) {
                    throw new IllegalStateException("Lô thuốc " + batch.getBatchCode() + " không đủ tồn kho.");
                }
                deductBatchStock(batch, quantity);
                unitPrice = batch.getUnitPrice();
                item.setExpiryDateSnapshot(batch.getExpiryDate());
            }

            unitPrice = unitPrice.setScale(2, RoundingMode.HALF_UP);
            item.setUnitPriceSnapshot(unitPrice);
            item.setAmount(unitPrice.multiply(BigDecimal.valueOf(quantity)));

            prescription.addItem(item);
        }

        if (prescription.getItems().isEmpty()) {
            throw new IllegalArgumentException("Đơn thuốc phải có ít nhất 1 thuốc");
        }
    }

    private void ensureServiceOrdersReadyForPrescription(Long visitId) {
        List<ServiceOrder> orders = serviceOrderRepository.findByVisitId(visitId);
        if (orders.isEmpty()) {
            return;
        }
        Map<Long, Boolean> requiredIndicatorCache = new HashMap<>();
        for (ServiceOrder order : orders) {
            ServiceOrderStatus status = order.getStatus();
            if (status == ServiceOrderStatus.PENDING
                    || status == ServiceOrderStatus.SCHEDULED
                    || status == ServiceOrderStatus.IN_PROGRESS) {
                throw new IllegalStateException(
                        "Phiếu dịch vụ " + order.getMedicalService().getName() + " chưa hoàn tất.");
            }
            if (requiresIndicatorResults(order, requiredIndicatorCache)
                    && status != ServiceOrderStatus.COMPLETED_WITH_RESULT) {
                throw new IllegalStateException(
                        "Phiếu dịch vụ " + order.getMedicalService().getName()
                                + " chưa nhập kết quả chỉ số.");
            }
        }
    }

    private boolean requiresIndicatorResults(ServiceOrder order, Map<Long, Boolean> cache) {
        Long serviceId = order.getMedicalService().getId();
        return cache.computeIfAbsent(serviceId,
                id -> !serviceIndicatorRepository.findByMedicalServiceIdAndRequiredTrue(id).isEmpty());
    }

    private PatientVisit loadVisit(Long visitId) {
        return patientVisitRepository.findById(visitId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy hồ sơ khám với id: " + visitId));
    }

    private Doctor loadDoctor(Long doctorId) {
        return doctorRepository.findById(doctorId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bác sĩ với id: " + doctorId));
    }

    private Medication loadMedication(Long medicationId) {
        return medicationRepository.findById(medicationId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thuốc với id: " + medicationId));
    }

    private MedicationBatch loadBatch(Long batchId) {
        return medicationBatchRepository.findById(batchId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy lô thuốc với id: " + batchId));
    }

    private void ensureVisitExists(Long visitId) {
        if (!patientVisitRepository.existsById(visitId)) {
            throw new EntityNotFoundException("Không tìm thấy hồ sơ khám với id: " + visitId);
        }
    }

    private LocalDateTime resolveIssuedAt(LocalDateTime issuedAt) {
        return issuedAt != null ? issuedAt : LocalDateTime.now();
    }

    private String normalizeText(String input) {
        if (!StringUtils.hasText(input)) {
            return null;
        }
        return input.trim();
    }

    private String requireText(String input, String message) {
        if (!StringUtils.hasText(input)) {
            throw new IllegalArgumentException(message);
        }
        return input.trim();
    }

    private void hydratePrescription(Prescription prescription) {
        if (prescription == null) {
            return;
        }
        prescription.getItems().forEach(item -> {
            if (item.getMedication() != null) {
                item.getMedication().getName();
            }
            if (item.getMedicationBatch() != null) {
                item.getMedicationBatch().getBatchCode();
            }
        });
    }

    private void returnStockForItem(PrescriptionItem item) {
        if (item.getMedicationBatch() != null && item.getQuantity() != null) {
            MedicationBatch batch = item.getMedicationBatch();
            batch.setQuantityOnHand(batch.getQuantityOnHand() + item.getQuantity());
            medicationBatchRepository.save(batch);
            if (batch.getMedication() != null) {
                Medication med = batch.getMedication();
                int current = med.getStockQuantity() != null ? med.getStockQuantity() : 0;
                med.setStockQuantity(current + item.getQuantity());
                medicationRepository.save(med);
            }
        }
    }

    private void deductBatchStock(MedicationBatch batch, int quantity) {
        if (batch.getQuantityOnHand() < quantity) {
            throw new IllegalStateException("Lô thuốc " + batch.getBatchCode() + " không đủ tồn kho.");
        }
        batch.setQuantityOnHand(batch.getQuantityOnHand() - quantity);
        medicationBatchRepository.save(batch);
        Medication med = batch.getMedication();
        if (med != null) {
            int current = med.getStockQuantity() != null ? med.getStockQuantity() : 0;
            if (current < quantity) {
                throw new IllegalStateException("Tồn kho thuốc không đủ.");
            }
            med.setStockQuantity(current - quantity);
            medicationRepository.save(med);
        }
    }

    private void validateBean(Prescription prescription) {
        var violations = validator.validate(prescription);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }
    }
}
