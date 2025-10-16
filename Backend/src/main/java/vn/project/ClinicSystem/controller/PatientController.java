package vn.project.ClinicSystem.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
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
import vn.project.ClinicSystem.model.Patient;
import vn.project.ClinicSystem.service.PatientService;

@RestController
@RequestMapping("/patients")
@Tag(name = "Patient Management", description = "API quản lý bệnh nhân")
public class PatientController {
    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @Operation(
        summary = "Tạo bệnh nhân mới",
        description = "Tạo thông tin bệnh nhân mới trong hệ thống"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201", 
            description = "Bệnh nhân được tạo thành công",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Patient.class),
                examples = @ExampleObject(
                    name = "Success Response",
                    value = """
                    {
                        "id": 1,
                        "name": "Nguyễn Văn A",
                        "email": "nguyenvana@email.com",
                        "phone": "0123456789",
                        "dateOfBirth": "1990-01-01",
                        "address": "123 Đường ABC, Quận 1, TP.HCM",
                        "gender": "MALE",
                        "medicalHistory": "Không có tiền sử bệnh"
                    }
                    """
                )
            )
        ),
        @ApiResponse(
            responseCode = "400", 
            description = "Dữ liệu đầu vào không hợp lệ",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Bad Request",
                    value = """
                    {
                        "error": "Validation failed",
                        "message": "Email is required"
                    }
                    """
                )
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
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @PostMapping
    public ResponseEntity<Patient> createPatient(
        @Parameter(description = "Thông tin bệnh nhân", required = true)
        @Valid @RequestBody Patient patient) {
        Patient created = patientService.create(patient);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(
        summary = "Lấy danh sách bệnh nhân",
        description = "Lấy danh sách bệnh nhân với phân trang và tìm kiếm"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Lấy danh sách bệnh nhân thành công",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Page.class),
                examples = @ExampleObject(
                    name = "Success Response",
                    value = """
                    {
                        "content": [
                            {
                                "id": 1,
                                "name": "Nguyễn Văn A",
                                "email": "nguyenvana@email.com",
                                "phone": "0123456789"
                            }
                        ],
                        "totalElements": 1,
                        "totalPages": 1,
                        "size": 10,
                        "number": 0
                    }
                    """
                )
            )
        )
    })
    @GetMapping
    public ResponseEntity<Page<Patient>> getPatients(
            @Parameter(description = "Số trang (bắt đầu từ 0)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Số lượng items per page", example = "10")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Từ khóa tìm kiếm", example = "Nguyễn Văn A")
            @RequestParam(value = "keyword", required = false) String keyword) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Patient> patients = patientService.searchByKeyword(keyword, pageable);
        return ResponseEntity.ok(patients);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(patientService.getById(id));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<Patient> getPatientByCode(@PathVariable("code") String code) {
        return ResponseEntity.ok(patientService.getByCode(code));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable("id") Long id, @RequestBody Patient patient) {
        Patient updated = patientService.update(id, patient);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable("id") Long id) {
        patientService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @GetMapping("/search")
    public ResponseEntity<List<Patient>> searchPatients(
            @RequestParam(value = "fullName", required = false) String fullName,
            @RequestParam(value = "dateOfBirth", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateOfBirth,
            @RequestParam(value = "phone", required = false) String phone) {
        return ResponseEntity.ok(patientService.searchPatients(fullName, dateOfBirth, phone));
    }

}
