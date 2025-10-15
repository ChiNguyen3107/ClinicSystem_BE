package vn.project.ClinicSystem.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import vn.project.ClinicSystem.model.ClinicRoom;
import vn.project.ClinicSystem.model.MedicalService;
import vn.project.ClinicSystem.model.dto.MedicalServiceRequest;
import vn.project.ClinicSystem.model.dto.MedicalServiceUpdateRequest;
import vn.project.ClinicSystem.repository.ClinicRoomRepository;
import vn.project.ClinicSystem.repository.MedicalServiceRepository;

@Service
@Transactional(readOnly = true)
public class MedicalServiceService {
    private final MedicalServiceRepository medicalServiceRepository;
    private final ClinicRoomRepository clinicRoomRepository;
    private final Validator validator;

    public MedicalServiceService(MedicalServiceRepository medicalServiceRepository,
            ClinicRoomRepository clinicRoomRepository,
            Validator validator) {
        this.medicalServiceRepository = medicalServiceRepository;
        this.clinicRoomRepository = clinicRoomRepository;
        this.validator = validator;
    }

    public List<MedicalService> findAll() {
        return medicalServiceRepository.findAll();
    }

    public List<MedicalService> findByClinicRoom(Long clinicRoomId) {
        return medicalServiceRepository.findByClinicRoomId(clinicRoomId);
    }

    public MedicalService getById(Long id) {
        return medicalServiceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy dịch vụ với id: " + id));
    }

    @Transactional
    public MedicalService create(MedicalServiceRequest request) {
        MedicalService service = new MedicalService();
        service.setCode(normalizeCode(request.getCode()));
        service.setName(request.getName());
        service.setBasePrice(request.getBasePrice());

        ClinicRoom clinicRoom = loadClinicRoom(request.getClinicRoomId());
        service.setClinicRoom(clinicRoom);

        validateBean(service);
        ensureCodeUnique(service.getCode(), null);
        return medicalServiceRepository.save(service);
    }

    @Transactional
    public MedicalService update(Long id, MedicalServiceUpdateRequest request) {
        MedicalService existing = getById(id);

        if (request.getCode() != null && !normalizeCode(request.getCode()).equalsIgnoreCase(existing.getCode())) {
            String normalized = normalizeCode(request.getCode());
            ensureCodeUnique(normalized, existing.getId());
            existing.setCode(normalized);
        }
        if (request.getName() != null) {
            existing.setName(request.getName());
        }
        if (request.getBasePrice() != null) {
            existing.setBasePrice(request.getBasePrice());
        }
        if (request.getClinicRoomId() != null) {
            ClinicRoom clinicRoom = loadClinicRoom(request.getClinicRoomId());
            existing.setClinicRoom(clinicRoom);
        }

        validateBean(existing);
        return medicalServiceRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!medicalServiceRepository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy dịch vụ với id: " + id);
        }
        medicalServiceRepository.deleteById(id);
    }

    private void ensureCodeUnique(String code, Long currentServiceId) {
        medicalServiceRepository.findByCode(code).ifPresent(existing -> {
            boolean same = currentServiceId != null && existing.getId().equals(currentServiceId);
            if (!same) {
                throw new EntityExistsException("Đã tồn tại dịch vụ với mã: " + code);
            }
        });
    }

    private ClinicRoom loadClinicRoom(Long clinicRoomId) {
        return clinicRoomRepository.findById(clinicRoomId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phòng với id: " + clinicRoomId));
    }

    private void validateBean(MedicalService service) {
        var violations = validator.validate(service);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }
    }

    private String normalizeCode(String code) {
        if (code == null) {
            throw new IllegalArgumentException("Mã dịch vụ không được null");
        }
        return code.trim().toUpperCase();
    }
}
