package vn.project.ClinicSystem.model;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import vn.project.ClinicSystem.model.enums.AppointmentRequestStatus;

@Getter
@Setter
@Entity
@Table(name = "appointment_requests")
public class AppointmentRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Họ tên không được để trống")
    @Column(length = 150, nullable = false)
    private String fullName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Column(length = 30, nullable = false)
    private String phone;

    @Email(message = "Email không hợp lệ")
    @Column(length = 120)
    private String email;

    @PastOrPresent(message = "Ngày sinh không hợp lệ")
    private LocalDate dateOfBirth;

    private LocalDateTime preferredAt;

    @Size(max = 1000)
    @Column(length = 1000)
    private String symptomDescription;

    @Size(max = 255)
    @Column(length = 255)
    private String staffNote;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private AppointmentRequestStatus status = AppointmentRequestStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_by")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private User processedBy;

    private Instant processedAt;

    @JsonIgnore
    @OneToOne(mappedBy = "request")
    private Appointment appointment;

    private Instant createdAt;
    private Instant updatedAt;

    @PrePersist
    public void handleBeforeCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    public void handleBeforeUpdate() {
        this.updatedAt = Instant.now();
    }
}
