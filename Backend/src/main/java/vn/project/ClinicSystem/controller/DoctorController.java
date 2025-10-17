package vn.project.ClinicSystem.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import vn.project.ClinicSystem.model.Doctor;
import vn.project.ClinicSystem.model.dto.DoctorCreateRequest;
import vn.project.ClinicSystem.service.DoctorService;

@RestController
@RequestMapping("/doctors")
@Tag(name = "Doctor Management", description = "API quản lý bác sĩ")
public class DoctorController {
    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @Operation(
        summary = "Tạo bác sĩ mới",
        description = "Tạo thông tin bác sĩ mới trong hệ thống (chỉ ADMIN)"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201", 
            description = "Tạo bác sĩ thành công",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Doctor.class)
            )
        ),
        @ApiResponse(
            responseCode = "403", 
            description = "Không có quyền truy cập",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Forbidden",
                    value = """
                    {
                        "error": "Forbidden",
                        "message": "Access denied"
                    }
                    """
                )
            )
        )
    })
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Doctor> createDoctor(
        @Parameter(description = "Thông tin bác sĩ mới", required = true)
        @Valid @RequestBody DoctorCreateRequest request) {
        Doctor created = doctorService.createForUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(
        summary = "Lấy danh sách bác sĩ",
        description = "Lấy danh sách bác sĩ với phân trang và lọc theo chuyên khoa"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Lấy danh sách bác sĩ thành công",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Page.class)
            )
        )
    })
    @GetMapping
    public ResponseEntity<Page<Doctor>> getDoctors(
            @Parameter(description = "Số trang (bắt đầu từ 0)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Số lượng bản ghi mỗi trang", example = "10")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Lọc theo chuyên khoa", example = "Cardiology")
            @RequestParam(value = "specialty", required = false) String specialty) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Doctor> doctors = doctorService.searchBySpecialty(specialty, pageable);
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(doctorService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable("id") Long id, @Valid @RequestBody Doctor doctor) {
        Doctor updated = doctorService.update(id, doctor);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable("id") Long id) {
        doctorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}