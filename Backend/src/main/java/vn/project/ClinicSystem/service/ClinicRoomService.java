package vn.project.ClinicSystem.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import vn.project.ClinicSystem.model.ClinicRoom;
import vn.project.ClinicSystem.repository.ClinicRoomRepository;

@Service
@Transactional(readOnly = true)
public class ClinicRoomService {
    private final ClinicRoomRepository clinicRoomRepository;
    private final Validator validator;

    public ClinicRoomService(ClinicRoomRepository clinicRoomRepository, Validator validator) {
        this.clinicRoomRepository = clinicRoomRepository;
        this.validator = validator;
    }

    public List<ClinicRoom> findAll() {
        return clinicRoomRepository.findAll();
    }

    public List<ClinicRoom> searchByFloor(String floor) {
        if (floor == null || floor.isBlank()) {
            return findAll();
        }
        List<ClinicRoom> rooms = clinicRoomRepository.findByFloorIgnoreCase(floor.trim());
        if (rooms.isEmpty()) {
            throw new EntityNotFoundException("Không tìm thấy phòng ở tầng/khu: " + floor);
        }
        return rooms;
    }

    public ClinicRoom getById(Long id) {
        return clinicRoomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phòng khám với id: " + id));
    }

    public ClinicRoom getByCode(String code) {
        String normalized = normalizeCode(code);
        return clinicRoomRepository.findByCode(normalized)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phòng với mã: " + normalized));
    }

    @Transactional
    public ClinicRoom create(ClinicRoom room) {
        if (room == null) {
            throw new IllegalArgumentException("Thông tin phòng khám không được null");
        }
        room.setCode(normalizeCode(room.getCode()));
        validateBean(room);
        validateUniqueCode(room.getCode(), null);
        return clinicRoomRepository.save(room);
    }

    @Transactional
    public ClinicRoom update(Long id, ClinicRoom changes) {
        if (changes == null) {
            throw new IllegalArgumentException("Thông tin phòng khám không được null");
        }
        ClinicRoom existing = getById(id);

        if (changes.getCode() != null && !normalizeCode(changes.getCode()).equalsIgnoreCase(existing.getCode())) {
            String normalized = normalizeCode(changes.getCode());
            validateUniqueCode(normalized, existing.getId());
            existing.setCode(normalized);
        }
        if (changes.getName() != null) {
            existing.setName(changes.getName());
        }
        if (changes.getFloor() != null) {
            existing.setFloor(changes.getFloor());
        }
        if (changes.getNote() != null) {
            existing.setNote(changes.getNote());
        }

        validateBean(existing);
        return clinicRoomRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!clinicRoomRepository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy phòng khám với id: " + id);
        }
        clinicRoomRepository.deleteById(id);
    }

    private void validateUniqueCode(String code, Long currentId) {
        clinicRoomRepository.findByCode(code).ifPresent(existing -> {
            boolean sameRecord = currentId != null && existing.getId().equals(currentId);
            if (!sameRecord) {
                throw new IllegalStateException("Mã phòng khám đã tồn tại: " + code);
            }
        });
    }

    private void validateBean(ClinicRoom clinicRoom) {
        var violations = validator.validate(clinicRoom);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }
    }

    private String normalizeCode(String code) {
        if (code == null) {
            throw new IllegalArgumentException("Mã phòng khám không được null");
        }
        return code.trim().toUpperCase();
    }
}