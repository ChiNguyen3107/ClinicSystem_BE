package vn.project.ClinicSystem.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "prescription_items")
public class PrescriptionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medication_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler", "prescriptionItems" })
    private Medication medication;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private MedicationBatch medicationBatch;

    @Size(max = 120, message = "Tên thuốc tối đa 120 ký tự")
    @Column(length = 120)
    private String medicationName;

    @NotBlank(message = "Liều dùng không được để trống")
    @Size(max = 80, message = "Liều dùng tối đa 80 ký tự")
    @Column(length = 80, nullable = false)
    private String dosage;

    @NotBlank(message = "Tần suất không được để trống")
    @Size(max = 80, message = "Tần suất tối đa 80 ký tự")
    @Column(length = 80, nullable = false)
    private String frequency;

    @Size(max = 80, message = "Thời gian sử dụng tối đa 80 ký tự")
    @Column(length = 80)
    private String duration;

    @Size(max = 255, message = "Hướng dẫn tối đa 255 ký tự")
    @Column(length = 255)
    private String instruction;

    @NotNull(message = "Cần nhập số lượng thuốc")
    @Positive(message = "Số lượng thuốc phải > 0")
    @Column(nullable = false)
    private Integer quantity;

    @Column(precision = 12, scale = 2)
    private BigDecimal unitPriceSnapshot;

    @Column(precision = 12, scale = 2)
    private BigDecimal amount;

    private LocalDate expiryDateSnapshot;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
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
