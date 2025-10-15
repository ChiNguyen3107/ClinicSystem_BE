package vn.project.ClinicSystem.model;

import java.time.Instant;
import java.time.LocalDateTime;

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
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import vn.project.ClinicSystem.model.enums.AppointmentStatus;

@Getter
@Setter
@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "doctor_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "clinic_room_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private ClinicRoom clinicRoom;

    @NotNull(message = "Thời gian khám không được bỏ trống")
    private LocalDateTime scheduledAt;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private AppointmentStatus status = AppointmentStatus.CONFIRMED;

    @Size(max = 500)
    @Column(length = 500)
    private String reason;

    @Size(max = 500)
    @Column(length = 500)
    private String notes;

    @NotNull(message = "Thời lượng khám không được để trống")
    @Positive(message = "Thời lượng khám phải lớn hơn 0")
    @Column(nullable = false)
    private Integer duration = 30;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private User createdBy;

    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    @OneToOne
    @JoinColumn(name = "request_id")
    private AppointmentRequest request;

    private Instant createdAt;
    private Instant updatedAt;

    @PrePersist
    public void handleBeforeCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.duration == null || this.duration <= 0) {
            this.duration = 30;
        }
    }

    @PreUpdate
    public void handleBeforeUpdate() {
        this.updatedAt = Instant.now();
        if (this.duration == null || this.duration <= 0) {
            this.duration = 30;
        }
    }
}
