package vn.project.ClinicSystem.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import jakarta.persistence.EntityNotFoundException;
import vn.project.ClinicSystem.model.AppointmentRequest;
import vn.project.ClinicSystem.model.Patient;
import vn.project.ClinicSystem.repository.PatientRepository;

@Service
@Transactional(readOnly = true)
public class PatientService {
    private final PatientRepository patientRepository;
    private final Validator validator;

    public PatientService(PatientRepository patientRepository, Validator validator) {
        this.patientRepository = patientRepository;
        this.validator = validator;
    }

    public List<Patient> findAll() {
        return patientRepository.findAll();
    }

    public List<Patient> searchByKeyword(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return findAll();
        }
        String normalized = keyword.trim();
        List<Patient> patients = patientRepository.findByFullNameContainingIgnoreCase(normalized);
        if (patients.isEmpty()) {
            throw new EntityNotFoundException("Không tìm thấy bệnh nhân với từ khóa: " + normalized);
        }
        return patients;
    }

    public Patient getById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bệnh nhân với id: " + id));
    }

    public Patient getByCode(String code) {
        String normalizedCode = normalizeCode(code);
        return patientRepository.findByCode(normalizedCode)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bệnh nhân với mã: " + normalizedCode));
    }

    @Transactional
    public Patient create(Patient patient) {
        if (patient == null) {
            throw new IllegalArgumentException("Thông tin bệnh nhân không được để trống");
        }
        patient.setCode(normalizeCode(patient.getCode()));
        validateBean(patient);
        validateUniqueCode(patient.getCode(), null);
        return patientRepository.save(patient);
    }

    @Transactional
    public Patient update(Long id, Patient changes) {
        if (changes == null) {
            throw new IllegalArgumentException("Thông tin bệnh nhân không được null");
        }
        Patient existing = getById(id);

        if (changes.getCode() != null && !normalizeCode(changes.getCode()).equalsIgnoreCase(existing.getCode())) {
            String normalized = normalizeCode(changes.getCode());
            validateUniqueCode(normalized, existing.getId());
            existing.setCode(normalized);
        }
        if (changes.getFullName() != null) {
            existing.setFullName(changes.getFullName());
        }
        if (changes.getGender() != null) {
            existing.setGender(changes.getGender());
        }
        if (changes.getDateOfBirth() != null) {
            existing.setDateOfBirth(changes.getDateOfBirth());
        }
        if (changes.getPhone() != null) {
            existing.setPhone(changes.getPhone());
        }
        if (changes.getEmail() != null) {
            existing.setEmail(changes.getEmail());
        }
        if (changes.getAddress() != null) {
            existing.setAddress(changes.getAddress());
        }
        // if (changes.getInsuranceNumber() != null) {
        // existing.setInsuranceNumber(changes.getInsuranceNumber());
        // }
        if (changes.getNote() != null) {
            existing.setNote(changes.getNote());
        }

        validateBean(existing);
        return patientRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy bệnh nhân với id: " + id);
        }
        patientRepository.deleteById(id);
    }

    @Transactional
    public Patient createFromAppointmentRequest(AppointmentRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Yêu cầu đặt lịch không được null");
        }
        Patient patient = new Patient();
        patient.setCode(generateUniqueCode());
        patient.setFullName(request.getFullName());
        patient.setDateOfBirth(request.getDateOfBirth());
        String normalizedPhone = normalizePhone(request.getPhone());
        if (normalizedPhone != null) {
            patient.setPhone(normalizedPhone);
        }
        patient.setEmail(request.getEmail());
        patient.setNote(buildAutoNote(request));
        return create(patient);
    }

    private void validateUniqueCode(String code, Long currentId) {
        patientRepository.findByCode(code).ifPresent(existing -> {
            boolean sameRecord = currentId != null && existing.getId().equals(currentId);
            if (!sameRecord) {
                throw new IllegalStateException("Mã bệnh nhân đã tồn tại: " + code);
            }
        });
    }

    private void validateBean(Patient patient) {
        var violations = validator.validate(patient);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }
    }

    private String normalizeCode(String code) {
        if (code == null) {
            throw new IllegalArgumentException("Mã bệnh nhân không được null");
        }
        return code.trim().toUpperCase();
    }

    private String generateUniqueCode() {
        String code;
        do {
            code = "BN" + UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8).toUpperCase();
        } while (patientRepository.existsByCodeIgnoreCase(code));
        return code;
    }

    private String normalizePhone(String phone) {
        if (phone == null) {
            return null;
        }
        String digits = phone.replaceAll("\\D", "");
        if (digits.length() == 10) {
            return digits;
        }
        return null;
    }

    private String buildAutoNote(AppointmentRequest request) {
        if (request.getId() != null) {
            return "Tạo từ yêu cầu đặt lịch #" + request.getId();
        }
        return "Tạo từ yêu cầu đặt lịch";
    }

    public List<Patient> searchPatients(String keyword, LocalDate dateOfBirth, String phone) {
        String normalizedKeyword = keyword != null ? keyword.trim() : null;
        String normalizedPhone = phone != null ? phone.trim() : null;

        boolean hasKeyword = normalizedKeyword != null && !normalizedKeyword.isEmpty();
        boolean hasDob = dateOfBirth != null;
        boolean hasPhone = normalizedPhone != null && !normalizedPhone.isEmpty();

        if (!hasKeyword && !hasDob && !hasPhone) {
            throw new IllegalArgumentException("Cần cung cấp ít nhất một tiêu chí tìm kiếm");
        }

        return patientRepository.searchPatients(
                hasKeyword ? normalizedKeyword : null,
                dateOfBirth,
                hasPhone ? normalizedPhone : null);
    }

}
