package vn.project.ClinicSystem.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.project.ClinicSystem.model.ClinicRoom;
import vn.project.ClinicSystem.service.ClinicRoomService;

@RestController
@RequestMapping("/clinic-rooms")
public class ClinicRoomController {
    private final ClinicRoomService clinicRoomService;

    public ClinicRoomController(ClinicRoomService clinicRoomService) {
        this.clinicRoomService = clinicRoomService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ClinicRoom> createClinicRoom(@Valid @RequestBody ClinicRoom room) {
        ClinicRoom created = clinicRoomService.create(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<ClinicRoom>> getClinicRooms(
            @RequestParam(value = "floor", required = false) String floor) {
        return ResponseEntity.ok(clinicRoomService.searchByFloor(floor));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClinicRoom> getClinicRoomById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(clinicRoomService.getById(id));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ClinicRoom> getClinicRoomByCode(@PathVariable("code") String code) {
        return ResponseEntity.ok(clinicRoomService.getByCode(code));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ClinicRoom> updateClinicRoom(@PathVariable("id") Long id,
            @RequestBody ClinicRoom room) {
        ClinicRoom updated = clinicRoomService.update(id, room);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClinicRoom(@PathVariable("id") Long id) {
        clinicRoomService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
